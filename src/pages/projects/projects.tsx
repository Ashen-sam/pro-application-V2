import { CommonTable, ProjectPriorityCommon, ProjectStatusCommon } from "@/components";
import { AvatarGroup } from "@/components/common/avatarCommon";
import { CircularProgress } from "@/components/common/cicularProgress";
import { CommonDialog } from "@/components/common/commonDialog";
import { CommonDialogFooter } from "@/components/common/commonDialogFooter";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleArrowOutUpRight, Edit, PackageCheck, PackagePlus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { ProjectForm } from "../../components/common/projectForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProjects, type Project } from "../projects/hooks/useProjects";
import { LinearLoader } from "@/components/common/CommonLoader";

export const Projects = () => {
    const {
        projects,
        currentUserId,
        isFetching,
        isError,
        isAddDialogOpen,
        isEditDialogOpen,
        isDeleteDialogOpen,
        selectedProject,
        formData,
        isCalendarOpen,
        isLoading,
        setIsAddDialogOpen,
        setFormData,
        setIsCalendarOpen,
        handleAddProject,
        handleAddProjectAndCreateAnother,
        handleEditClick,
        handleUpdateProject,
        handleDeleteClick,
        handleDeleteProject,
        handleDialogOpenChange,
        handleNavigateToProject,
        refetch,
        selectedRows,
        setSelectedRows,
        isBulkDeleteDialogOpen,
        handleBulkDeleteClick,
        handleBulkDeleteProject,
    } = useProjects();

    const tableColumns = useMemo(() => [
        {
            key: "name",
            header: "Project Name",
            accessor: (row: Project) => row.name,
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            accessor: (row: Project) => <ProjectStatusCommon status={row.status} />,
        },
        {
            key: "priority",
            header: "Priority",
            accessor: (row: Project) => <ProjectPriorityCommon priority={row.priority} />,
        },
        {
            key: "progress",
            header: "Progress",
            accessor: (row: Project) => <CircularProgress value={row.progress} />,
        },
        {
            key: "dueDate",
            header: "Due Date",
            accessor: (row: Project) => (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span>{row.dueDate}</span>
                </div>
            ),
        },
        {
            key: "members",
            header: "Members",
            accessor: (row: Project) => {
                const membersForAvatar = row.memeberEmails?.map((email, index) => {
                    const namePart = email.split("@")[0];
                    const name = namePart.replace(/[._\d]+/g, " ");
                    return { id: index, name };
                }) || [];

                return membersForAvatar.length > 0 ? (
                    <AvatarGroup
                        members={membersForAvatar}
                        max={3}
                        size="sm"
                    />
                ) : (
                    <span className="text-sm text-muted-foreground">No members</span>
                );
            },
        },
    ], []);

    const tableActions = useMemo(() => [
        {
            label: "View",
            onClick: (row: Project) => handleNavigateToProject(row.project_id),
            icon: <CircleArrowOutUpRight />,
        },
        {
            label: "Edit",
            onClick: (row: Project) => handleEditClick(row),
            icon: <Edit />,
        },
        {
            label: "Delete",
            onClick: (row: Project) => handleDeleteClick(row),
            icon: <Trash2 />,
        },
    ], [handleNavigateToProject, handleEditClick, handleDeleteClick]);

    if (!currentUserId) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Please log in to view your projects
                    </p>
                </div>
            </div>
        );
    }

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <LinearLoader />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <Alert className="max-w-sm border-muted">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <AlertTitle className="text-sm font-medium">
                        Unable to load projects
                    </AlertTitle>

                    <AlertDescription className="mt-2 flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground">
                            Please try again.
                        </span>

                        <Button
                            onClick={() => refetch()}
                            variant="outline"
                            size="sm"
                        >
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
            {projects.length === 0 ? (
                <div className="flex items-center justify-center min-h-[700px]">
                    <div className="flex flex-col items-center max-w-md text-center space-y-4 px-6">
                        <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10">
                            <PackagePlus className="h-10 w-10 text-primary" />
                        </div>

                        <div className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold tracking-tight">
                            Projects
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Projects are larger units of work with a clear outcome, such as a new
                            feature you want to ship. They can be shared across multiple teams and
                            are comprised of optional documents.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="gap-2 dark:text-white text-xs"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                Create new project
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <PackagePlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage and organize your projects ({projects.length})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 text-xs"
                                onClick={() => setIsAddDialogOpen(true)}
                                disabled={isLoading}
                            >
                                <PackagePlus />
                                Create Project
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 text-xs"
                                disabled={selectedRows.length === 0}
                                onClick={handleBulkDeleteClick}
                            >
                                <Trash2 />
                                Delete
                            </Button>
                        </div>
                    </div>
                    <CommonTable
                        selectable
                        rowKey="project_id"
                        data={projects}
                        columns={tableColumns}
                        onSelectionChange={setSelectedRows}
                        actions={tableActions}
                    />
                </div>
            )}
            <CommonDialog
                className="min-w-[720px]"
                icon={<PackagePlus size={20} className="text-primary" />}
                note="Invite your team to review and Collaboration"
                open={isAddDialogOpen}
                onOpenChange={(open) => handleDialogOpenChange('add', open)}
                title="Create New Project"
                size="sm"
                footer={
                    <CommonDialogFooter
                        info="Fill in the details to create a new project"
                        onCancel={() => handleDialogOpenChange('add', false)}
                        onConfirm={handleAddProject}
                        onConfirmAndCreateAnother={handleAddProjectAndCreateAnother}
                        cancelText="Cancel"
                        confirmText="Create Project"
                        enableCreateAnother={true}
                        formMode="add"
                    />
                }
            >
                <ProjectForm
                    formData={formData}
                    onFormChange={setFormData}
                    isCalendarOpen={isCalendarOpen}
                    onCalendarOpenChange={setIsCalendarOpen}
                    isSubmitting={isLoading}
                />
            </CommonDialog>
            <CommonDialog
                className="min-w-[720px]"
                icon={<PackageCheck className="text-primary" size={20} />}
                note="Invite your team to review and Collaboration"
                open={isEditDialogOpen}
                onOpenChange={(open) => handleDialogOpenChange('edit', open)}
                title="Update Project"
                size="lg"
                footer={
                    <CommonDialogFooter
                        onCancel={() => handleDialogOpenChange('edit', false)}
                        onConfirm={handleUpdateProject}
                        cancelText="Cancel"
                        confirmText={"Update Project"}
                    />
                }
            >
                <ProjectForm
                    formData={formData}
                    onFormChange={setFormData}
                    isCalendarOpen={isCalendarOpen}
                    onCalendarOpenChange={setIsCalendarOpen}
                    isSubmitting={isLoading}
                />
            </CommonDialog>
            <CommonDialog
                icon={<Trash2 className="text-red-400" size={20} />}
                note="This action cannot be undone"
                open={isDeleteDialogOpen}
                onOpenChange={(open) => handleDialogOpenChange('delete', open)}
                title="Delete Project"
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => handleDialogOpenChange('delete', false)}
                        onConfirm={handleDeleteProject}
                        cancelText="Cancel"
                        confirmText={"Delete Project"}
                        confirmVariant="destructive"
                    />
                }
            >
                <div className="text-sm text-muted-foreground">
                    The project{" "}
                    <strong className="text-red-400">{selectedProject?.name}</strong> and all associated
                    data will be permanently deleted.
                </div>
            </CommonDialog>
            <CommonDialog
                icon={<Trash2 className="text-red-400" size={20} />}
                note="This action cannot be undone"
                open={isBulkDeleteDialogOpen}
                onOpenChange={(open) => handleDialogOpenChange('bulkDelete', open)}
                title={`Delete ${selectedRows.length} Project(s)`}
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => handleDialogOpenChange('bulkDelete', false)}
                        onConfirm={handleBulkDeleteProject}
                        cancelText="Cancel"
                        confirmText={`Delete ${selectedRows.length} Project(s)`}
                        confirmVariant="destructive"
                    />
                }
            >
                <div className="text-sm text-muted-foreground">
                    You are about to delete{" "}
                    <strong className="text-red-400">{selectedRows.length} project(s)</strong>.
                    All associated data will be permanently deleted.
                </div>
            </CommonDialog>
        </>
    );
};