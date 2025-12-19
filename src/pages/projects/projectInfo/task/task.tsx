import { LinearLoader } from "@/components/common/CommonLoader";
import { TaskTable } from "@/components/common/taskTable";
import { useTasks } from "@/pages/projects/hooks/useTasks";
import { useOutletContext } from "react-router";

type OverviewContext = {
    userId: string | number;
    projectId: string | number;
};

export const Task = () => {
    const { projectId } = useOutletContext<OverviewContext>();

    const { tasks, isLoading, handleTaskChange, handleTaskAdd, handleTaskDelete } =
        useTasks({ projectId });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LinearLoader />
            </div>
        );
    }

    if (!projectId) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">No project selected</div>
            </div>
        );
    }

    return (
        <div>
            <TaskTable
                tasks={tasks}
                onTaskChange={handleTaskChange}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
            />
        </div>
    );
};