import { ProjectStatusCommon, type StatusType } from "@/components";
import { UserAvatar } from "@/components/common/avatar";
import { AvatarGroup } from "@/components/common/avatarCommon";
import { CircularProgress } from "@/components/common/cicularProgress";
import { LinearLoader } from "@/components/common/CommonLoader";
import { ProjectPriorityCommon, type PriorityType } from "@/components/common/projectPriorityCommon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetProjectByIdQuery, useListProjectMembersQuery } from "@/features/projectsApi";
import { Check, Package } from "lucide-react";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

interface OverviewContext {
    projectId: number;
}


export const Overview = () => {
    const { projectId } = useOutletContext<OverviewContext>();

    const { data: projectData, isLoading: isProjectLoading, error: projectError } = useGetProjectByIdQuery(
        projectId,
        { skip: !projectId }
    );
    console.log('API Error:', projectError); // ✅ Check what error is returned
    console.log('Requesting projectId:', projectId);

    const { data: membersData, isLoading: isMembersLoading } = useListProjectMembersQuery(
        projectId, // ✅ Use string directly
        { skip: !projectId }
    );

    const project = projectData;
    const projectMembers = membersData || [];
    const isLoading = isProjectLoading || isMembersLoading;

    const projectProgress = useMemo(() => {
        if (!project) return 0;
        const statusProgress: Record<string, number> = {
            'pending': 10,
            'in_review': 30,
            'in_progress': 60,
            'submitted': 80,
            'success': 100
        };
        return statusProgress[project.status?.toLowerCase() || ''] || 0;
    }, [project]);

    const formattedMembers = useMemo(() => {
        if (!projectMembers || projectMembers.length === 0) return [];
        return projectMembers.map((member) => ({
            id: member.user_id,
            name: member.users?.name || member.users?.email.split("@")[0] || "Unknown",
            image: ""
        }));
    }, [projectMembers]);

    const daysRemaining = useMemo(() => {
        if (!project?.end_date) return 0;
        const today = new Date();
        const endDate = new Date(project.end_date);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [project]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LinearLoader />
            </div>
        );
    }

    if (projectError || !project) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Failed to load project data</p>
            </div>
        );
    }

    const mapApiStatusToUi = (apiStatus?: string): StatusType => {
        const map: Record<string, StatusType> = {
            "On track": "On track",
            "Off track": "Off track",
            "At risk": "At risk",
            "Completed": "Completed"
        };
        return map[apiStatus || "On track"] || "On track";
    };

    const mappedStatus: StatusType = project.status
        ? mapApiStatusToUi(project.status)
        : "On track";

    const mappedPriority = (project.priority ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1) : 'Medium') as PriorityType;
    const taskCount = 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Project Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] ">
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
                            <div className="flex items-center gap-6 ">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        Status
                                    </label>
                                    <ProjectStatusCommon padding={false} status={mappedStatus} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        Priority
                                    </label>
                                    <ProjectPriorityCommon padding={false} priority={mappedPriority} />
                                </div>
                                {project.end_date && (
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                            Due Date
                                        </label>
                                        <div className="flex items-center gap-2  border shadow-xs px-2 text-xs font-medium   py-1 rounded-sm  ">
                                            <span>{new Date(project.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 block">
                                        tasks
                                    </label>
                                    <div className="flex items-center gap-2 justify-center text-xs font-medium  py-1 rounded-sm border shadow-xs">
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
                                <div className="text-sm break-all text-foreground/80 leading-relaxed">
                                    {project.description || 'No description available'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Members */}
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
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
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                            </div>
                            <div className="pt-2">
                                <CircularProgress
                                    className='bg-primary'
                                    value={projectProgress}
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
                                    {' '}
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
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {project.created_at && (
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
                                )}

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