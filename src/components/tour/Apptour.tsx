import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useUser } from '@clerk/clerk-react';

export const AppTour = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        // Wait for Clerk to load
        if (!isLoaded || !user) return;

        // Check if user has completed tour - this is the primary check
        const completedKey = `hasCompletedTour_${user.id}`;
        const completed = localStorage.getItem(completedKey);

        // If tour is already completed, don't show it again
        if (completed) return;

        // Check if this is a new user (created in last 5 minutes)
        const userCreatedAt = user.createdAt ? new Date(user.createdAt).getTime() : 0;
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        const isNewUser = userCreatedAt > fiveMinutesAgo;

        // Only start tour for new users who haven't completed it and haven't started yet
        if (isNewUser && !hasStarted) {
            setHasStarted(true);
            injectCustomStyles();
            // Start tour after delay for DOM to load
            setTimeout(() => {
                startTour(user.id);
            }, 1500);
        }
    }, [hasStarted, user, isLoaded]);

    const injectCustomStyles = () => {
        // Check if styles already injected
        if (document.getElementById('driver-custom-styles')) return;

        const style = document.createElement('style');
        style.id = 'driver-custom-styles';
        style.innerHTML = `
            .driver-popover {
                background: white !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                padding: 0 !important;
                max-width: 400px !important;
            }

            .dark .driver-popover {
                background: #1a1a1a !important;
                border: 1px solid #2a2a2a !important;
            }

            .driver-popover-title {
                font-size: 18px !important;
                font-weight: 600 !important;
                color: #111827 !important;
                padding: 20px 20px 12px 20px !important;
                margin: 0 !important;
                border-bottom: none !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }

            .dark .driver-popover-title {
                color: #ffffff !important;
            }

            .driver-popover-description {
                font-size: 14px !important;
                line-height: 1.6 !important;
                color: #6b7280 !important;
                padding: 0 20px 20px 20px !important;
                margin: 0 !important;
            }

            .dark .driver-popover-description {
                color: #9ca3af !important;
            }

            .driver-popover-footer {
                padding: 16px 20px !important;
                border-top: 1px solid #f3f4f6 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                background: #fafafa !important;
                border-radius: 0 0 12px 12px !important;
            }

            .dark .driver-popover-footer {
                background: #141414 !important;
                border-top: 1px solid #2a2a2a !important;
            }

            .driver-popover-progress-text {
                font-size: 13px !important;
                color: #6b7280 !important;
                font-weight: 500 !important;
            }

            .dark .driver-popover-progress-text {
                color: #9ca3af !important;
            }

            .driver-popover-navigation-btns {
                display: flex !important;
                gap: 8px !important;
            }

            .driver-popover-btn {
                padding: 8px 16px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                border-radius: 8px !important;
                border: 1px solid #e5e7eb !important;
                background: white !important;
                color: #374151 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }

            .driver-popover-btn:hover {
                background: #f9fafb !important;
                border-color: #d1d5db !important;
            }

            .dark .driver-popover-btn {
                background: #2a2a2a !important;
                border-color: #3a3a3a !important;
                color: #e5e7eb !important;
            }

            .dark .driver-popover-btn:hover {
                background: #3a3a3a !important;
                border-color: #4a4a4a !important;
            }

            .driver-popover-next-btn,
            .driver-popover-btn-primary {
                background: hsl(var(--primary)) !important;
                color: white !important;
                border: none !important;
            }

            .driver-popover-next-btn:hover,
            .driver-popover-btn-primary:hover {
                opacity: 0.9 !important;
            }

            .driver-popover-close-btn {
                position: absolute !important;
                top: 16px !important;
                right: 16px !important;
                width: 32px !important;
                height: 32px !important;
                border-radius: 6px !important;
                background: #f3f4f6 !important;
                border: none !important;
                color: #6b7280 !important;
                font-size: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }

            .driver-popover-close-btn:hover {
                background: #e5e7eb !important;
                color: #374151 !important;
            }

            .dark .driver-popover-close-btn {
                background: #2a2a2a !important;
                color: #9ca3af !important;
            }

            .dark .driver-popover-close-btn:hover {
                background: #3a3a3a !important;
                color: #e5e7eb !important;
            }

            .driver-overlay {
                background: rgba(0, 0, 0, 0.5) !important;
            }

            .driver-active-element {
                border-radius: 12px !important;
            }
        `;
        document.head.appendChild(style);
    };

    const createIconHTML = (iconName: string) => {
        const icons: Record<string, string> = {
            'sparkles': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
            'sidebar': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/></svg>',
            'sun-moon': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
            'inbox': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
            'folder': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
            'check': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
            'calendar': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
            'git-branch': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
            'rocket': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
            'party': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>',
            'settings': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
            'archive': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>'
        };
        return icons[iconName] || '';
    };

    const startTour = (userId: string) => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('sparkles')}<span>Welcome to Your Project Hub</span></div>`,
                        description: 'Let me guide you through your dashboard and all the powerful features available to help you manage your projects effectively.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '#sidebar-navigation',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('sidebar')}<span>Navigation Sidebar</span></div>`,
                        description: 'This is your main navigation hub. Access all your workspaces, tools, and settings from here. You can collapse it for more screen space.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#theme-toggle',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('sun-moon')}<span>Theme Switcher</span></div>`,
                        description: 'Switch between light, dark, and system themes. Choose the one that\'s most comfortable for your eyes.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#nav-overview',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('inbox')}<span>Overview Dashboard</span></div>`,
                        description: 'Your home base! Get a quick overview of all your projects, tasks, and upcoming deadlines at a glance.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#nav-projects',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('folder')}<span>Projects</span></div>`,
                        description: 'Manage all your projects here. Create new projects, organize tasks, and track progress in one centralized location.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#nav-calendar',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('calendar')}<span>Calendar View</span></div>`,
                        description: 'Visualize your schedule with deadlines, milestones, and important dates. Never miss a deadline again!',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#nav-flow',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('archive')}<span>Project Flow</span></div>`,
                        description: 'Define and visualize your workflow. Connect tasks and see how your project flows from start to finish.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#nav-settings',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('settings')}<span>Settings</span></div>`,
                        description: 'Customize your experience, manage your account, and configure preferences to make this tool work best for you.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '#step-create-project',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('folder')}<span>Create Project</span></div>`,
                        description: 'Start by creating a new project. This is where you\'ll organize all your tasks, collaborate with your team, and track progress.',
                        side: 'bottom',
                        align: 'start'
                    }
                },
                {
                    element: '#step-create-tasks',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('check')}<span>Create Tasks</span></div>`,
                        description: 'Add and organize tasks for your projects. Break down your work into manageable pieces and assign them to team members.',
                        side: 'bottom',
                        align: 'start'
                    }
                },
                {
                    element: '#step-plan-schedule',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('calendar')}<span>Plan Your Schedule</span></div>`,
                        description: 'Visualize deadlines and milestones with a calendar view. Keep your team aligned and ensure everyone stays on track.',
                        side: 'top',
                        align: 'start'
                    }
                },
                {
                    element: '#step-define-workflow',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('git-branch')}<span>Define Workflow</span></div>`,
                        description: 'Customize workflows and connect tasks to visualize your project flow. Create a system that works perfectly for your team.',
                        side: 'top',
                        align: 'start'
                    }
                },
                {
                    element: '#start-project-button',
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('rocket')}<span>Ready to Begin</span></div>`,
                        description: 'Click this button when you\'re ready to create your first project and start managing your work effectively.',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: `<div style="display: flex; align-items: center; gap: 10px; color: hsl(var(--primary));">${createIconHTML('party')}<span>You're All Set!</span></div>`,
                        description: 'You can restart this tour anytime from the Settings menu. We\'re excited to see what you\'ll accomplish!',
                    }
                }
            ],
            onDestroyed: () => {
                // Save completion per user
                localStorage.setItem(`hasCompletedTour_${userId}`, 'true');
            }
        });

        driverObj.drive();
    };

    return null;
};