import { CommonTable, ProjectPriorityCommon, ProjectStatusCommon } from "@/components";
import { AvatarGroup } from "@/components/common/avatarCommon";
import { CircularProgress } from "@/components/common/cicularProgress";
import { CommonDialog } from "@/components/common/commonDialog";
import { CommonDialogFooter } from "@/components/common/commonDialogFooter";
import { LinearLoader } from "@/components/common/CommonLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AlertCircle, CalendarPlus, FileText, FolderOpen, PackagePlus, Plus, Trash2, UserRoundPlus } from "lucide-react";
import { useMemo } from "react";
import { ProjectForm } from "../../components/common/projectForm";
import { useProjects, type Project } from "../projects/hooks/useProjects";

export const Projects = () => {
    const {
        projects,
        currentUserId,
        isFetching,
        isError,
        isAddDialogOpen,
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
        handleDeleteClick,
        handleDeleteProject,
        setIsTitleDialogOpen,
        handleDialogOpenChange,
        handleNavigateToProject,
        setIsDescriptionDialogOpen,
        setTitleProject,
        setDescriptionProject,
        isTitleDialogOpen,
        titleInput,
        setTitleInput,
        handleEditTitle,
        handleSaveTitle,
        isDescriptionDialogOpen,
        descriptionInput,
        setDescriptionInput,
        handleAddDescriptionClick,
        handleSaveDescription,
        refetch,
        selectedRows,
        setSelectedRows,
        isBulkDeleteDialogOpen,
        handleBulkDeleteClick,
        handleBulkDeleteProject,
        handleUpdateProject,
    } = useProjects();

    const tableColumns = useMemo(() => [
        {
            key: "name",
            header: "Project Name",
            accessor: (row: Project) => row.name,

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
            accessor: (row: Project) => {
                if (!row.dateRange || !row.dateRange.from) {
                    return (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-2"><CalendarPlus size={16} />-</span>
                        </div>
                    );
                }

                const fromDate = row.dateRange.from ? format(new Date(row.dateRange.from), "MMM dd") : "";
                const toDate = row.dateRange.to ? format(new Date(row.dateRange.to), "MMM dd, yyyy") : "";

                return (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span>{toDate ? `${fromDate} - ${toDate}` : fromDate}</span>
                    </div>
                );
            },
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
                    <div className="flex items-center gap-2">
                        <UserRoundPlus size={15} />
                        <span>Invite</span>
                    </div>
                );
            },
        },
    ], []);

    const handleViewRow = (row: Project) => {
        handleNavigateToProject(row.project_id);
    };

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

                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-20 w-20 rounded-full bg-primary/80 blur-3xl"></div>

                            <PackagePlus className="h-10 w-10 text-primary" />
                        </div>

                        {/* Title */}
                        <div className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold tracking-tight">
                            Projects
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Projects are larger units of work with a clear outcome, such as a new
                            feature you want to ship. They can be shared across multiple teams and
                            are comprised of optional documents.
                        </p>

                        {/* Action */}
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
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 rounded-lg border border-primary/12">
                        <div className="flex  gap-3 ">
                            <div className="flex mt-px justify-center  rounded-lg ">
                                <FolderOpen size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-medium  text-white">
                                    Manage and organize your projects ({projects.length})
                                </div>
                                <div className="text-xs font-medium text-gray-400">
                                    Manage  projects efficiently
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2  text-xs bg-transparent   hover:bg-gray-800"
                                onClick={() => setIsAddDialogOpen(true)}
                                disabled={isLoading}
                            >
                                <Plus size={16} />
                                Project
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 text-xs bg-transparent border-gray-700 text-white hover:bg-gray-800"
                                disabled={selectedRows.length === 0}
                                onClick={handleBulkDeleteClick}
                            >
                                <Trash2 size={16} />

                            </Button>
                        </div>
                    </div>
                    <CommonTable
                        selectable
                        rowKey="project_id"
                        data={projects}
                        columns={tableColumns}
                        onSelectionChange={setSelectedRows}
                        onUpdateProject={handleUpdateProject}
                        onViewRow={handleViewRow}
                        onDeleteRow={handleDeleteClick}
                        onAddDescription={handleAddDescriptionClick}
                        onEditTitle={handleEditTitle}
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
                className="min-w-[500px]"
                icon={<FileText size={20} className="text-primary" />}
                note="Update project title"
                open={isTitleDialogOpen}
                onOpenChange={setIsTitleDialogOpen}
                title={`Edit Title`}
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => {
                            setIsTitleDialogOpen(false);
                            setTitleProject(null);
                            setTitleInput("");
                        }}
                        onConfirm={handleSaveTitle}
                        cancelText="Cancel"
                        confirmText="Save Title"
                    />
                }
            >
                <div className="space-y-3">
                    <Textarea
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        placeholder="Enter project title"
                        className="min-h-20 text-sm resize-none rounded-sm"
                    />
                </div>
            </CommonDialog>

            <CommonDialog
                className="min-w-[600px]"
                icon={<FileText size={20} className="text-primary" />}
                note="Add or update project description"
                open={isDescriptionDialogOpen}
                onOpenChange={setIsDescriptionDialogOpen}
                title={`Edit Description`}
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => {
                            setIsDescriptionDialogOpen(false);
                            setDescriptionProject(null);
                            setDescriptionInput("");
                        }}
                        onConfirm={handleSaveDescription}
                        cancelText="Cancel"
                        confirmText="Save Description"
                    />
                }
            >
                <div className="w-full wrap-break-word overflow-wrap-anywhere">
                    <Textarea
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        placeholder="Write a description, a project brief..."
                        className="min-h-[200px] text-sm resize-none wrap-break-word"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    />
                </div>
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
                        confirmText="Delete Project"
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