import { ProjectPriorityCommon, ProjectStatusCommon, type PriorityType, type StatusType } from "@/components";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, CheckCheck, Users } from "lucide-react";
import { useCallback, useState } from "react";

export interface FormData {
    name: string;
    description: string;
    status: StatusType;
    priority: PriorityType;
    teamMembers: string[];
    memeberEmails: string[];
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}
// eslint-disable-next-line react-refresh/only-export-components
export const initialFormData: FormData = {
    name: "",
    description: "",
    status: "On track",
    priority: "Medium",
    teamMembers: [],
    memeberEmails: [],
    dateRange: {
        from: undefined,
        to: undefined,
    },
};
interface ProjectFormProps {
    formData: FormData;
    onFormChange: (data: FormData) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
}
export const ProjectForm: React.FC<ProjectFormProps> = ({
    formData,
    onFormChange,
    isCalendarOpen,
    onCalendarOpenChange,
    isSubmitting,
}) => {
    const [statusOpen, setStatusOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [teamMembersOpen, setTeamMembersOpen] = useState(false);
    const EMAIL_DOMAINS = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "icloud.com",
        "proton.me",
        "yopmail.com",
        "mail.com",
        "zoho.com",
        "gmx.com",
        "tutanota.com",
    ];
    const getEmailSuggestions = (value: string): string[] => {
        if (!value.includes("@")) return [];

        const [local, domain = ""] = value.split("@");

        return EMAIL_DOMAINS
            .filter(d => d.startsWith(domain))
            .map(d => `${local}@${d}`);
    };
    const [emailInput, setEmailInput] = useState("");
    const emailSuggestions = getEmailSuggestions(emailInput);
    const handleFieldChange = useCallback((field: keyof FormData, value: unknown) => {
        onFormChange({ ...formData, [field]: value });
    }, [formData, onFormChange]);
    const statusOptions: StatusType[] = ["On track", "At risk", "Off track", "Completed"];
    const priorityOptions: PriorityType[] = ["Low", "Medium", "High"];

    return (
        <div className="space-y-5 border dark:border-[#313131] rounded-sm p-6">
            <div className="space-y-1.5">
                <Input
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Project name"
                    className="h-8 rounded-sm placeholder:text-lg border-0 p-0 text-5xl bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isSubmitting}
                    autoComplete="off"
                />
            </div>
            <div className="flex items-center gap-2">
                <Popover open={teamMembersOpen} onOpenChange={setTeamMembersOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs bg-transparent rounded-sm border"
                            disabled={isSubmitting}
                            type="button"
                        >
                            <Users />

                            {(formData.memeberEmails || []).length === 0 ? " Invite " : `${formData.memeberEmails.length} Member(s)`}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-3 rounded-sm" align="start">
                        <Label className="text-xs font-medium">Invite Members</Label>

                        {/* Selected emails */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {formData.memeberEmails.map((email) => (
                                <span
                                    key={email}
                                    className="flex bg-primary/20 items-center gap-1 px-2 py-1 text-xs rounded"
                                >
                                    {email}
                                    <button
                                        onClick={() =>
                                            handleFieldChange(
                                                "memeberEmails",
                                                formData.memeberEmails.filter(e => e !== email)
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Email input */}
                        <Input
                            placeholder="Type email..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && emailInput) {
                                    handleFieldChange("memeberEmails", [
                                        ...formData.memeberEmails,
                                        emailInput,
                                    ]);
                                    setEmailInput("");
                                }
                            }}
                            className="h-8 text-sm"
                        />
                        {emailSuggestions.length > 0 && (
                            <div className="mt-2 space-y-1 border rounded-sm">
                                {emailSuggestions.map((email) => (
                                    <button
                                        key={email}
                                        className="w-full text-left px-2 py-1 text-sm hover:bg-accent"
                                        onClick={() => {
                                            handleFieldChange("memeberEmails", [
                                                ...formData.memeberEmails,
                                                email,
                                            ]);
                                            setEmailInput("");
                                        }}
                                    >
                                        {email}
                                    </button>
                                ))}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-sm border hover:bg-accent p-0 px-2"
                            disabled={isSubmitting}
                            type="button"
                        >
                            <ProjectStatusCommon status={formData.status} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-1 rounded-sm" align="start">
                        <div className="flex flex-col">
                            <div className="text-xs flex border-b py-2 pl-3 ">Status</div>
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    className="flex w-full   items-center py-1 text-sm rounded-none hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer"
                                    onClick={() => {
                                        handleFieldChange("status", status);
                                        setStatusOpen(false);
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <ProjectStatusCommon status={status} />
                                        {status === formData.status && (
                                            <div className="text-muted-foreground pr-4 text-xs"><CheckCheck size={16} /></div>

                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-sm border bg-transparent hover:bg-accent p-0 px-2"
                            disabled={isSubmitting}
                            type="button"
                        >
                            <ProjectPriorityCommon priority={formData.priority} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-1 rounded-sm" align="start">
                        <div className="flex flex-col">
                            <div className="text-xs flex border-b py-2 pl-3">Priority</div>
                            {priorityOptions.map((priority) => (
                                <button
                                    key={priority}
                                    className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer"
                                    onClick={() => {
                                        handleFieldChange("priority", priority);
                                        setPriorityOpen(false);
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <ProjectPriorityCommon priority={priority} />
                                        {priority === formData.priority && (
                                            <div className="text-muted-foreground pr-3 text-xs"><CheckCheck size={16} /></div>

                                        )}
                                    </div>

                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            size="sm"
                            className="h-7 text-xs rounded-sm border"
                            disabled={isSubmitting}
                            type="button"
                        >
                            <CalendarIcon />
                            {formData.dateRange.from ? (
                                formData.dateRange.to ? (
                                    <>
                                        {format(formData.dateRange.from, "MMM dd")} - {format(formData.dateRange.to, "MMM dd")}
                                    </>
                                ) : (
                                    format(formData.dateRange.from, "MMM dd, y")
                                )
                            ) : (
                                "Date"
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
                        <Calendar
                            mode="range"
                            selected={formData.dateRange}
                            onSelect={(range) => {
                                handleFieldChange("dateRange", range || { from: undefined, to: undefined });
                            }}
                            onDayClick={() => {
                                // Prevent popover from closing on first date selection
                                if (formData.dateRange.from && !formData.dateRange.to) {
                                    onCalendarOpenChange(true);
                                }
                            }}
                            numberOfMonths={2}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="border-b p-0">
            </div>
            <div className="space-y-1.5">
                <Textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Write a description, a project brief..."
                    className="min-h-30 text-sm p-0 resize-none rounded-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
};