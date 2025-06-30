<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Social login routes
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::get('facebook', [AuthController::class, 'redirectToFacebook']);
    Route::get('facebook/callback', [AuthController::class, 'handleFacebookCallback']);
});

// Protected routes requiring authentication
Route::middleware(['auth:api', 'check.activity'])->group(function () {
    
    // User authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('refresh', [AuthController::class, 'refreshToken']);
    });
    
    // Application management routes
    Route::prefix('application')->group(function () {
        Route::post('save-draft', [ApplicationController::class, 'saveDraft']);
        Route::get('load-draft', [ApplicationController::class, 'loadDraft']);
        Route::post('submit', [ApplicationController::class, 'submitApplication']);
        Route::get('my-applications', [ApplicationController::class, 'getUserApplications']);
        Route::get('{id}', [ApplicationController::class, 'getApplication']);
    });
    
    // Admin-only routes
    Route::middleware(['check.role:admin'])->prefix('admin')->group(function () {
        Route::get('dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin dashboard data',
                'data' => [
                    'total_applications' => \App\Models\ApplicationSubmission::count(),
                    'pending_review' => \App\Models\ApplicationSubmission::where('status', 'submitted')->count(),
                    'accepted' => \App\Models\ApplicationSubmission::where('status', 'accepted')->count(),
                    'rejected' => \App\Models\ApplicationSubmission::where('status', 'rejected')->count(),
                ],
            ]);
        });
        
        Route::get('applications', function () {
            $applications = \App\Models\ApplicationSubmission::with(['user'])
                ->orderBy('submitted_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $applications,
            ]);
        });
        
        Route::put('applications/{id}/status', function (Request $request, $id) {
            $application = \App\Models\ApplicationSubmission::findOrFail($id);
            
            $request->validate([
                'status' => 'required|in:submitted,review,accepted,rejected',
                'comments' => 'nullable|string',
            ]);
            
            $application->update([
                'status' => $request->status,
                'review_comments' => $request->comments,
                'decision_date' => in_array($request->status, ['accepted', 'rejected']) ? now() : null,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully',
                'data' => $application,
            ]);
        });
        
        // User management routes
        Route::get('users', function () {
            $users = \App\Models\User::with('roles')
                ->orderBy('created_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        });
        
        Route::put('users/{id}/role', function (Request $request, $id) {
            $user = \App\Models\User::findOrFail($id);
            
            $request->validate([
                'role' => 'required|in:admin,user',
            ]);
            
            // Remove all existing roles and assign new role
            $user->syncRoles([$request->role]);
            
            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => $user->load('roles'),
            ]);
        });
        
        Route::post('users', function (Request $request) {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,user',
            ]);
            
            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                'email_verified_at' => now(),
            ]);
            
            $user->assignRole($request->role);
            
            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user->load('roles'),
            ]);
        });
        
        Route::delete('users/{id}', function ($id) {
            $user = \App\Models\User::findOrFail($id);
            
            // Prevent deleting the current admin
            if (auth()->id() === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete your own account',
                ], 400);
            }
            
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        });
    });
    

});

// Health check route
Route::get('health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
    ]);
}); 