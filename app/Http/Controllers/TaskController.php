<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
{
    $perPage = $request->input('per_page', 9);
    $search = $request->query('search');
    $status = $request->query('status');
    $assigneeId = $request->query('assignee_id'); // New parameter
    $currentUser = Auth::user();
    $isAdmin = $currentUser->role === 'admin';

    // Update overdue tasks in bulk
    Task::whereNotNull('due_date_time')
        ->where('due_date_time', '<', now())
        ->where('status', '!=', 'done')
        ->update(['status' => 'overdue']);

    $tasksQuery = Task::query();

    // Always apply assignee_id filter for non-admin users
    if (!$isAdmin) {
        $tasksQuery->where('assignee_id', $currentUser->id);
    }

    // Respect assignee_id parameter for non-admin users
    if ($assigneeId && !$isAdmin && $assigneeId == $currentUser->id) {
        $tasksQuery->where('assignee_id', $assigneeId);
    }

    // Apply search filter
    $tasksQuery->when($search, function ($query, $search) use ($isAdmin, $currentUser) {
        $query->where(function ($q) use ($search, $isAdmin, $currentUser) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
            // Ensure assignee_id filter is preserved for non-admin users
            if (!$isAdmin) {
                $q->where('assignee_id', $currentUser->id);
            }
        });
    });

    // Apply status filter
    $tasksQuery->when($status, function ($query, $status) use ($isAdmin, $currentUser) {
        $query->where('status', $status);
        // Ensure assignee_id filter is preserved for non-admin users
        if (!$isAdmin) {
            $query->where('assignee_id', $currentUser->id);
        }
    });

    $tasksQuery->orderBy('created_at', 'desc');

    $tasks = $tasksQuery->paginate($perPage)
        ->withQueryString()
        ->through(function ($task) {
            return $this->formatTask($task);
        });

    $users = User::all(['id', 'name']);

    return Inertia::render('assignee', [
        'tasks' => $tasks,
        'users' => $users,
        'isAdmin' => $isAdmin,
        'search' => $search,
        'status' => $status,
    ]);
}

    public function store(Request $request)
    {
        Log::info('Full request data:', $request->all());
        Log::info('Files in request:', $request->allFiles());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attached_file' => 'nullable|file|max:10240',
            'assignee_id' => 'required|exists:users,id',
            'due_date_time' => 'required|date',
            'started_date' => 'required|date',
            'status' => 'required|in:pending,on progress,done,overdue',
        ]);

        $filePath = null;
        if ($request->hasFile('attached_file')) {
            $filePath = $request->file('attached_file')->store('task_files', 'public');
        }

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'attached_file' => $filePath,
            'assignee_id' => $validated['assignee_id'],
            'due_date_time' => $validated['due_date_time'],
            'started_date' => $validated['started_date'],
            'status' => $validated['status'],
            'created_by' => Auth::id(),
        ]);

        $currentUser = Auth::user();
        $isAdmin = $currentUser->role === 'admin';

        // Notify assignee (if not the current user)
        if ($task->assignee_id != $currentUser->id) {
            Notification::create([
                'user_id' => $isAdmin ? null : $currentUser->id, // Null for admin to show as "Tasko"
                'recipient_id' => $task->assignee_id,
                'message' => "New task assigned: '{$task->title}' due on {$task->due_date_time->format('Y-m-d H:i')}.",
                'is_read' => false,
            ]);
        }

        // Notify admins (only if the current user is not an admin)
        if (!$isAdmin) {
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                // Ensure the admin is not the current user (redundant but safe)
                if ($admin->id !== $currentUser->id) {
                    Notification::create([
                        'user_id' => $currentUser->id,
                        'recipient_id' => $admin->id,
                        'message' => "New task '{$task->title}' assigned to " . User::find($task->assignee_id)->name . ".",
                        'is_read' => false,
                    ]);
                }
            }
        }

        return redirect()->route('assignee.index')->with('success', 'Task created successfully!');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attached_file' => 'nullable|file|max:10240',
            'assignee_id' => 'required|exists:users,id',
            'due_date_time' => 'required|date',
            'started_date' => 'required|date',
            'status' => 'required|in:pending,on progress,done,overdue',
            'remove_file' => 'nullable|in:1',
        ]);

        $filePath = $task->attached_file;
        if ($request->input('remove_file') == '1') {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
                $filePath = null;
            }
        } elseif ($request->hasFile('attached_file')) {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('attached_file')->store('task_files', 'public');
        }

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'attached_file' => $filePath,
            'assignee_id' => $validated['assignee_id'],
            'due_date_time' => $validated['due_date_time'],
            'started_date' => $validated['started_date'],
            'status' => $validated['status'],
        ]);

        $currentUser = Auth::user();
        $isAdmin = $currentUser->role === 'admin';

        // Notify assignee if reassigned (only if not the current user)
        if ($task->wasChanged('assignee_id') && $task->assignee_id != $currentUser->id) {
            Notification::create([
                'user_id' => $isAdmin ? null : $currentUser->id, // Null for admin to show as "Tasko"
                'recipient_id' => $task->assignee_id,
                'message' => "Task reassigned to you: '{$task->title}' due on {$task->due_date_time->format('Y-m-d H:i')}.",
                'is_read' => false,
            ]);
        }

        // Notify if status changed
        if ($task->wasChanged('status')) {
            // Notify assignee (if not the current user)
            if ($task->assignee_id != $currentUser->id) {
                Notification::create([
                    'user_id' => $isAdmin ? null : $currentUser->id, // Null for admin to show as "Tasko"
                    'recipient_id' => $task->assignee_id,
                    'message' => "Task '{$task->title}' status updated to {$task->status}.",
                    'is_read' => false,
                ]);
            }

            // Notify admins (only if the current user is not an admin)
            if (!$isAdmin) {
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    // Ensure the admin is not the current user (redundant but safe)
                    if ($admin->id !== $currentUser->id) {
                        Notification::create([
                            'user_id' => $currentUser->id,
                            'recipient_id' => $admin->id,
                            'message' => "Tasko: Task '{$task->title}' status updated to {$task->status} for " . User::find($task->assignee_id)->name . ".",
                            'is_read' => false,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('assignee.index')->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        if ($task->attached_file) {
            Storage::disk('public')->delete($task->attached_file);
        }

        $task->delete();
        return redirect()->route('assignee.index')->with('success', 'Task deleted successfully!');
    }

    protected function formatTask($task)
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'attached_file' => $task->attached_file ? Storage::url($task->attached_file) : null,
            'assignee_id' => $task->assignee_id,
            'assignee' => User::find($task->assignee_id)?->name ?? 'Unknown',
            'due_date_time' => $task->due_date_time?->toISOString() ?? null,
            'started_date_time' => $task->started_date?->toISOString() ?? null,
            'status' => $task->status,
        ];
    }
}