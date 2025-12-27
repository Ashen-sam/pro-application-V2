import { ProjectPriorityCommon, ProjectStatusCommon, type PriorityType, type StatusType } from '@/components';
import { CircularProgress } from '@/components/common/cicularProgress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import logo from '../../../public/Screenshot_2025-12-27_164922-removebg-preview.png'
import {
    Bolt,
    Calendar,
    ChevronLeft,
    FolderArchive,
    FolderOpen,
    GitBranch,
    Layers,
    Moon,
    Plus,
    Settings,
    Sun,
    Target,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export const Landing = () => {
    const [scrollY, setScrollY] = useState(0);
    const [darkMode, setDarkMode] = useState(true);
    interface Project {
        id: number;
        name: string;
        status: StatusType;
        priority: PriorityType;
        progress: number;
        dueDate: string;
        members: string[]; // or Member[] if you have a Member type
    }
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const menuItems = [
        { id: 'overview', icon: Bolt, label: 'Overview', section: 'main' },
        { id: 'projects', icon: FolderOpen, label: 'Projects', section: 'workspace' },
        { id: 'calendar', icon: Calendar, label: 'Calendar', section: 'workspace' },
        { id: 'flow', icon: FolderArchive, label: 'Flow', section: 'workspace' },
        { id: 'settings', icon: Settings, label: 'Settings', section: 'bottom' }
    ];
    const calendarFeatures = [
        {
            title: "Task Scheduling",
            description: "Schedule tasks directly on your calendar and set deadlines with visual timelines.",
            icon: <Target className="w-5 h-5" />
        },
        {
            title: "Project Milestones",
            description: "Track project milestones and key deliverables across all your teams.",
            icon: <FolderOpen className="w-5 h-5" />
        },
        {
            title: "Team Availability",
            description: "See team member availability and coordinate schedules effortlessly.",
            icon: <Calendar className="w-5 h-5" />
        }
    ];


    const sampleProjects: Project[] = [
        {
            id: 1,
            name: "Web Development",
            status: "On track",
            priority: "Low",
            progress: 65,
            dueDate: "Jan 05 - Jan 12, 2026",
            members: []
        },
        {
            id: 2,
            name: "Mobile App Design",
            status: "Off track",
            priority: "High",
            progress: 45,
            dueDate: "Jan 10 - Jan 20, 2026",
            members: []
        },
        {
            id: 3,
            name: "Marketing Campaign",
            status: "At risk",
            priority: "Medium",
            progress: 30,
            dueDate: "Jan 08 - Jan 15, 2026",
            members: []
        },
        {
            id: 4,
            name: "Database Migration",
            status: "Completed",
            priority: "High",
            progress: 80,
            dueDate: "Jan 12 - Jan 18, 2026",
            members: []
        },
        {
            id: 5,
            name: "UI/UX Redesign",
            status: "Completed",
            priority: "Low",
            progress: 55,
            dueDate: "Jan 15 - Jan 25, 2026",
            members: []
        },
    ];

    const workflows = [
        {
            icon: <GitBranch className="w-5 h-5" />,
            title: "Initiatives",
            description: "Coordinate strategic product efforts."
        },
        {
            icon: <Layers className="w-5 h-5" />,
            title: "Cross-team projects",
            description: "Collaborate across teams and departments."
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: "Milestones",
            description: "Break projects down into concrete phases."
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Progress insights",
            description: "Track scope, velocity, and progress over time."
        }
    ];

    const sidebarItemVariants: Variants = {
        hidden: {
            opacity: 0,
            x: -20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'dark:bg-[#141414] text-gray-400'
            : 'bg-white text-gray-600'
            }`}>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20
                    ? darkMode
                        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
                        : 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
                    : 'bg-transparent'
                    }`}>
                <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className={`text-base font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                            <img src={logo} width={40} height={80} alt="boardy logo" />
                        </div>
                        <div className={`hidden md:flex items-center gap-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            <a href="#features" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'
                                }`}>Features</a>
                            <a href="#method" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'
                                }`}>Method</a>
                            <a href="#customers" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'
                                }`}>Customers</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg transition-colors ${darkMode
                                ? 'hover:bg-white/10 text-gray-400'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </motion.button>
                        <Link
                            to={'/login'}
                            className={`hidden sm:flex text-sm ${darkMode
                                ? 'text-white hover:text-white hover:bg-white/10 bg-transparent'
                                : 'text-black hover:text-black hover:bg-gray-100 bg-transparent'
                                }`}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-32 px-6 overflow-hidden">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div className="z-10">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-6 leading-[1.1] ${darkMode ? 'text-white' : 'text-black'}`}>
                                Boardy is a purpose built tool for planning and building products
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Meet the system for modern software development.<br />
                                Streamline issues, projects, and product roadmaps.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-wrap items-center gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className={`text-sm px-6 py-6 ${darkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}>
                                        Start building
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="ghost"
                                        className={`text-sm px-6 py-6 ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'}`}>
                                        New: Linear agent for Slack →
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="relative"
                            style={{
                                perspective: '2000px',
                                transformStyle: 'preserve-3d'
                            }}>
                            <div>
                                <div
                                    className={`rounded-xl overflow-hidden ${darkMode ? 'dark:bg-transparent border border-white/10' : 'bg-transparent border border-gray-200'}`}
                                    style={{
                                        boxShadow: darkMode
                                            ? '0 50px 100px rgba(0, 0, 0, 0.9), 0 0 100px rgba(255, 255, 255, 0.05)'
                                            : '0 50px 100px rgba(0, 0, 0, 0.3)'
                                    }}>
                                    <div className={`flex items-center gap-2 px-3 py-2 border-b ${darkMode ? 'border-white/10 bg-transparent' : 'border-gray-200'}`}>
                                        <div className="flex gap-1">
                                            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>
                                            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>
                                            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>
                                        </div>
                                        <div className={`flex-1 mx-3 px-2 py-0.5 rounded text-[9px] ${darkMode ? 'bg-white/5 text-gray-500' : 'bg-white text-gray-500'}`}>
                                            app.projectflow.com
                                        </div>
                                    </div>
                                    <div className="flex gap-10 h-[500px] mt-20 px-10 relative">
                                        <div className={`text-base font-medium absolute -top-16 right-155  ${darkMode ? 'text-white' : 'text-black'}`}>
                                            <img src={logo} width={27} height={80} alt="boardy logo" />
                                        </div>
                                        <div className={`w-40 ${darkMode ? 'dark:bg-transparent text-white' : 'bg-white text-black'} ${darkMode ? 'border-white/10' : 'border-gray-200'} flex flex-col`}>
                                            <motion.div
                                                className="px-4 border-white/10"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1.0, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="font-semibold text-sm">Ashen Samarasekera</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            Free Plan · Ashen@gmail.com
                                                        </div>
                                                    </div>
                                                    <button className="p-1.5 hover:bg-white/5 rounded">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setDarkMode(!darkMode)}
                                                    className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                                                >
                                                    <Moon className="w-4 h-4" />
                                                </button>
                                            </motion.div>

                                            <div className="flex-1 p-3 overflow-y-auto">
                                                <div className="mb-6">
                                                    {menuItems
                                                        .filter(item => item.section === 'main')
                                                        .map((item, index) => {
                                                            const Icon = item.icon;
                                                            return (
                                                                <motion.button
                                                                    key={item.id}
                                                                    custom={index}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                    variants={sidebarItemVariants}
                                                                    transition={{
                                                                        delay: 1.2 + index * 0.08,
                                                                        duration: 0.5,
                                                                        ease: [0.25, 0.46, 0.45, 0.94]
                                                                    }}
                                                                    whileHover={{
                                                                        x: 4,
                                                                        transition: { duration: 0.2, ease: "easeOut" }
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode
                                                                        ? 'bg-white/10 dark:text-slate-200'
                                                                        : 'bg-gray-100 text-black'
                                                                        }`}
                                                                >
                                                                    <Icon className="w-4 h-4 text-gray-700 dark:text-slate-200" />
                                                                    <span className='text-gray-700 dark:text-slate-200'>{item.label}</span>
                                                                </motion.button>
                                                            );
                                                        })}
                                                </div>
                                                <div>
                                                    <motion.div
                                                        className={`text-xs font-medium mb-2 px-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 1.3, duration: 0.4 }}
                                                    >
                                                        WORK SPACE
                                                    </motion.div>
                                                    <div className="space-y-1">
                                                        {menuItems
                                                            .filter(item => item.section === 'workspace')
                                                            .map((item, index) => {
                                                                const Icon = item.icon;
                                                                return (
                                                                    <motion.button
                                                                        key={item.id}
                                                                        custom={index + 1}
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        variants={sidebarItemVariants}
                                                                        whileHover={{
                                                                            x: 4,
                                                                            transition: { duration: 0.2, ease: "easeOut" }
                                                                        }}
                                                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode
                                                                            ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                            : 'text-gray-600 hover:text-black'
                                                                            }`}
                                                                    >
                                                                        <Icon className="w-4 h-4 text-gray-700 dark:text-slate-200" />
                                                                        <span className='text-gray-700 dark:text-slate-200'>{item.label}</span>
                                                                    </motion.button>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 border-t border-white/10">
                                                {menuItems
                                                    .filter(item => item.section === 'bottom')
                                                    .map((item, index) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <motion.button
                                                                key={item.id}
                                                                custom={index + 5}
                                                                initial="hidden"
                                                                animate="visible"
                                                                variants={sidebarItemVariants}
                                                                whileHover={{
                                                                    x: 4,
                                                                    transition: { duration: 0.2, ease: "easeOut" }
                                                                }}
                                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode
                                                                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                    : 'text-gray-600 hover:text-black'
                                                                    }`}
                                                            >
                                                                <Icon className="w-4 h-4 text-gray-700 dark:text-slate-200" />
                                                                <span className='text-gray-700 dark:text-slate-200'>{item.label}</span>
                                                            </motion.button>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                        <div className={`w-[800px] ${darkMode ? 'dark:bg-[#141414]' : 'bg-transparent'}`}>
                                            <div className={`w-full text-left flex items-center justify-between p-3 bg-primary/8 rounded-lg border border-primary/12 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <FolderOpen size={20} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                        <div className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-black'}`}>
                                                            Manage and organize your projects (1)
                                                        </div>
                                                    </div>
                                                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                                        Manage projects efficiently
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="gap-1.5 flex text-[9px] bg-transparent hover:bg-gray-800">
                                                        <Plus size={10} />
                                                        Project
                                                    </button>
                                                    <button className="gap-1.5 text-[9px] bg-transparent border-gray-700 text-white hover:bg-gray-800">
                                                        <Trash2 size={9} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto border mt-2 rounded-sm">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className={`border-b ${darkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                                                            <th className="text-left py-2 px-3 font-medium w-6 text-[8px]">
                                                                <Checkbox />
                                                            </th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Project Name</th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Status</th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Priority</th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Progress</th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Due Date</th>
                                                            <th className="text-left py-2 px-3 font-medium text-[8px]">Members</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sampleProjects.map((project, index) => (
                                                            <motion.tr
                                                                key={project.id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 1.8 + index * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                                className={`border-b text-left ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                                <td className="py-2 px-3">
                                                                    <Checkbox />
                                                                </td>
                                                                <td className={`py-2 px-3 font-medium text-[9px] ${darkMode ? 'text-white' : 'text-black'}`}>
                                                                    {project.name}
                                                                </td>
                                                                <td className="py-2 px-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={`text-[8px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                            <ProjectStatusCommon status={project.status} />
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                            <ProjectPriorityCommon priority={project.priority} />
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className={`text-[8px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                            <CircularProgress value={project.progress} />
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className={`py-2 px-3 text-[8px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    {project.dueDate}
                                                                </td>
                                                                <td className="py-2 px-3">
                                                                    <button className={`text-[8px] ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                                                                        Invite
                                                                    </button>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div
                                                className="pointer-events-none absolute top-0 right-0 h-full w-40"
                                                style={{
                                                    background: darkMode
                                                        ? 'linear-gradient(to left, rgba(20,20,20,1), rgba(20,20,20,0))'
                                                        : 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div
                                    className="absolute inset-0 -z-10 blur-3xl opacity-30"
                                    style={{
                                        background: darkMode
                                            ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 70%)'
                                            : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1), transparent 70%)'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <section className="py-20 px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl md:text-4xl font-medium mb-4 ${darkMode ? 'text-white' : 'text-black'
                            }`}>
                            Workflows for every team
                        </h2>
                        <p className={`text-base max-w-[600px] mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            From startups to enterprises, ProjectFlow adapts to your workflow and scales with your team's needs.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {workflows.map((workflow, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className={`p-6 rounded-xl ${darkMode
                                    ? 'dark:bg-[#141414] border border-white/10'
                                    : 'bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${darkMode ? 'bg-white/10' : 'bg-white'
                                    }`}>
                                    <div className={darkMode ? 'text-white' : 'text-black'}>
                                        {workflow.icon}
                                    </div>
                                </div>
                                <h3 className={`text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-black'
                                    }`}>
                                    {workflow.title}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {workflow.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>
            <section className="py-20 px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="max-w-[1200px] mx-auto">

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Description */}
                        <motion.div variants={itemVariants}>
                            <h2 className={`text-3xl md:text-4xl font-medium mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                                View your work in calendar mode
                            </h2>
                            <p className={`text-base mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Visualize all your projects, tasks, and deadlines in a unified calendar view.
                                Switch between list and calendar modes to see your work the way that makes sense for you.
                            </p>

                            <div className="space-y-6">
                                {calendarFeatures.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-white/10' : 'bg-gray-100'
                                            }`}>
                                            <div className={darkMode ? 'text-white' : 'text-black'}>
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                {feature.title}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side - Calendar Preview */}
                        <motion.div
                            variants={itemVariants}
                            className={`p-6 rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'
                                }`}>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                    January 2026
                                </h3>
                                <div className="flex gap-2">
                                    <button className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'
                                        }`}>
                                        Calendar
                                    </button>
                                    <button className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        List
                                    </button>
                                </div>
                            </div>

                            {/* Mini Calendar */}
                            <div className="grid grid-cols-7 gap-1 mb-6">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                    <div key={idx} className={`text-center text-xs py-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'
                                        }`}>
                                        {day}
                                    </div>
                                ))}

                                {Array.from({ length: 35 }, (_, i) => {
                                    const day = i - 2;
                                    const isCurrentMonth = day > 0 && day <= 31;
                                    const hasTask = [5, 8, 12, 15, 18, 22, 25].includes(day);
                                    const hasProject = [10, 15, 20].includes(day);

                                    return (
                                        <div
                                            key={i}
                                            className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs relative p-1
                                    ${!isCurrentMonth ? (darkMode ? 'text-gray-700' : 'text-gray-300') : ''}
                                    ${isCurrentMonth ? (darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-200') : ''}
                                `}>
                                            {isCurrentMonth ? day : ''}
                                            {hasTask && (
                                                <div className={`w-1 h-1 rounded-full mt-0.5 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'
                                                    }`} />
                                            )}
                                            {hasProject && (
                                                <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'
                                                    }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend & Sample Items */}
                            <div className={`pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-4 mb-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'
                                            }`} />
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tasks</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'
                                            }`} />
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Projects</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'
                                                    }`}>
                                                    Design Review
                                                </div>
                                                <div className={`text-[10px] ${darkMode ? 'text-blue-400/70' : 'text-blue-600/70'
                                                    }`}>
                                                    Jan 15, 2:00 PM
                                                </div>
                                            </div>
                                            <Checkbox />
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-700'
                                                    }`}>
                                                    Web Development
                                                </div>
                                                <div className={`text-[10px] ${darkMode ? 'text-purple-400/70' : 'text-purple-600/70'
                                                    }`}>
                                                    Due: Jan 20
                                                </div>
                                            </div>
                                            <div className={`text-[10px] px-2 py-0.5 rounded ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                65%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}