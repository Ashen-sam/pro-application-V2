import { UserAvatar } from "@/components/common/avatar";
import { AvatarGroup } from "@/components/common/avatarCommon";
import { CircularProgress } from "@/components/common/cicularProgress";
import { ProjectPriorityCommon, type PriorityType } from "@/components/common/projectPriorityCommon";
import { ProjectStatusCommon, type StatusType } from "@/components/common/projectStatusCommon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Check, Package, Loader2 } from "lucide-react";
import { useGetProjectByIdQuery, useGetProjectMembersQuery } from "../../../../features/projectsApi";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

// Props interface
interface OverviewProps {
    projectId: number;
}

export const Overview = () => {
    const { userId, projectId } = useOutletContext<OverviewContext>();
    // Fetch project data
    const {
        data: project,
        isFetching: isProjectLoading,
        error: projectError
    } = useGetProjectByIdQuery(projectId, {
        skip: !projectId
    });

    // Fetch project members
    const {
        data: projectMembers,
        isFetching: isMembersLoading
    } = useGetProjectMembersQuery(projectId, {
        skip: !projectId
    });

    // Calculate project progress
    const projectProgress = useMemo(() => {
        if (!project) return 0;
        const statusProgress = {
            'pending': 10,
            'in_review': 30,
            'in_progress': 60,
            'submitted': 80,
            'success': 100
        };
        return statusProgress[project.status] || 0;
    }, [project]);

    // Format members for AvatarGroup
    const formattedMembers = useMemo(() => {
        if (!projectMembers) return [];
        return projectMembers.map((member) => ({
            id: member.user_id,
            name: `User ${member.user_id}`,
            image: ""
        }));
    }, [projectMembers]);

    // Calculate days remaining
    const daysRemaining = useMemo(() => {
        if (!project) return 0;
        const today = new Date();
        const endDate = new Date(project.end_date);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [project]);

    // Loading state
    if (isProjectLoading || isMembersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Error state
    if (projectError || !project) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-destructive">Error loading project</p>
                    <p className="text-sm text-muted-foreground">
                        {projectError ? 'Failed to fetch project details' : 'Project not found'}
                    </p>
                </div>
            </div>
        );
    }

    // Map API status to component StatusType
    const mappedStatus = project.status === 'in_progress' ? 'In progress' :
        project.status === 'in_review' ? 'In review' :
            project.status === 'pending' ? 'Pending' :
                project.status === 'submitted' ? 'Submitted' : 'Success';

    // Map API priority to component PriorityType
    const mappedPriority = (project.priority.charAt(0).toUpperCase() + project.priority.slice(1)) as PriorityType;

    // Count tasks (placeholder - you'll need to implement task counting)
    const taskCount = 0; // TODO: Implement task counting from tasks API

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Project Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                        <CardContent className="space-y-5">
                            {/* Project Name */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                                    Project Name
                                </label>
                                <div className='flex items-center gap-2'>
                                    <h3 className="text-lg font-bold text-gray-700 dark:text-foreground">
                                        {project.name}
                                    </h3>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Status, Priority, Due Date Grid */}
                            <div className="flex items-center gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        Status
                                    </label>
                                    <ProjectStatusCommon status={mappedStatus as StatusType} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        Priority
                                    </label>
                                    <ProjectPriorityCommon priority={mappedPriority} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        Due Date
                                    </label>
                                    <div className="flex items-center gap-2 text-xs font-medium bg-muted/50 px-3 py-1 rounded-sm border shadow-xs">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span>{new Date(project.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        tasks
                                    </label>
                                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-sm border shadow-xs">
                                        <span>{taskCount}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                                    Description
                                </label>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Members */}
                    <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Project Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formattedMembers.length > 0 ? (
                                <AvatarGroup members={formattedMembers} />
                            ) : (
                                <p className="text-sm text-muted-foreground">No members added yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary & Activity */}
                <div className="space-y-6">
                    {/* Summary */}
                    <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                            </div>
                            <div className="pt-2">
                                <CircularProgress
                                    className='bg-primary'
                                    value={projectProgress}
                                    size="sm"
                                    showLabel={false}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2">
                                    {projectProgress === 100 ? 'Completed!' :
                                        projectProgress >= 60 ? 'On track!' :
                                            projectProgress >= 30 ? 'In progress' : 'Getting started'}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                    This project focuses on delivering a streamlined and efficient solution to meet business needs.

                                    {daysRemaining > 0 ? `${daysRemaining} days remaining until deadline.` :
                                        daysRemaining === 0 ? 'Due today!' :
                                            'Project deadline has passed.'}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    name="Project Owner"
                                    image=""
                                    size="md"
                                />
                                <div>
                                    <p className="text-sm font-medium">Project Owner</p>
                                    <p className="text-xs text-muted-foreground">ID: {project.owner_id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">Project created</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">Status updated to {mappedStatus}</p>
                                        <p className="text-xs text-muted-foreground">Current status</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">{formattedMembers.length} team members</p>
                                        <p className="text-xs text-muted-foreground">Active collaborators</p>
                                    </div>
                                </div>

                                <Button variant="link" className="text-primary p-0 h-auto text-sm">
                                    View All
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};