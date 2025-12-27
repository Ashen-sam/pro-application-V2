import { CommonDialog } from '@/components/common/commonDialog';
import { CommonDialogFooter } from '@/components/common/commonDialogFooter';
import { LinearLoader } from '@/components/common/CommonLoader';
import { showToast } from '@/components/common/commonToast';
import { SectionToolbar } from '@/components/common/SectionToolbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDeleteUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '@/features/auth/authApi';
import { Camera, Loader2, SettingsIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
}

export const Settings = () => {
    const currentUserId = parseInt(localStorage.getItem('userId') || '1');
    const { data: currentUser, isLoading: isLoadingUser, error: userError } = useGetUserByIdQuery(currentUserId);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
    const [, setEmailError] = useState('');
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Split full_name into firstName and lastName if it exists
            const nameParts = currentUser.full_name?.split(' ') || ['', ''];
            setProfileData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: currentUser.email || '',
                phone: '',
                address: '',
                bio: ''
            });

            // Set profile image if available
            if (currentUser.profile_picture) {
                setProfileImage(currentUser.profile_picture);
            }
        }
    }, [currentUser]);

    const handleProfileChange = (field: keyof ProfileData, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
                showToast.success("Profile picture updated", "profile-picture-success");
            };
            reader.onerror = () => {
                showToast.error("Failed to upload image", "profile-picture-error");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const updateData = {
                full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
                email: profileData.email,
                profile_picture: profileImage
            };

            await updateUser({
                userId: currentUserId,
                data: updateData
            }).unwrap();

            showToast.success("Profile updated successfully", "profile-update-success");
        } catch (error) {
            const errorMsg = 'Failed to update profile';
            console.error(error);
            showToast.error(errorMsg, "profile-update-error");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser(currentUserId).unwrap();

            showToast.success("Account deleted successfully", "account-delete-success");
            setTimeout(() => {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }, 1500);
        } catch (error) {
            const errorMsg = 'Failed to delete account';
            console.error(error);
            showToast.error(errorMsg, "account-delete-error");
            setIsDeleteDialogOpen(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[500px] ">
                <LinearLoader />
            </div>
        );
    }

    if (userError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Alert className="max-w-md border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        Failed to load user data. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="">
            <div className="">
                <SectionToolbar
                    title="Manage and organize your projects"
                    subtitle="Manage projects efficiently"
                    icon={<SettingsIcon size={18} />}

                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div className=" gap-0 rounded-md backdrop-blur-xl bg-white/70 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a]  overflow-hidden">
                        <div className="p-4 bg-white/40 dark:bg-[#1a1a1a] backdrop-blur-xl space-y-5 text-xs text-gray-900 dark:text-slate-200">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-normal ">
                                    Profile picture
                                </Label>
                                <div className="relative">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-700"
                                    />
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute -bottom-1 -right-1 bg-blue-600  p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <Camera className="w-3 h-3" />
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <Label htmlFor="email" className="text-sm font-normal text-gray-900 dark:text-slate-200">
                                    Email
                                </Label>
                                <div className="w-64">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleProfileChange('email', e.target.value)}
                                        className="text-right text-xs"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Full Name Row */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="fullName" className="text-sm font-normal text-slate-900 dark:text-gray-200">
                                    Full name
                                </Label>
                                <div className="w-64">
                                    <Input
                                        id="fullName"
                                        value={`${profileData.firstName} ${profileData.lastName}`}
                                        onChange={(e) => {
                                            const names = e.target.value.split(' ');
                                            handleProfileChange('firstName', names[0] || '');
                                            handleProfileChange('lastName', names.slice(1).join(' ') || '');
                                        }}
                                        className="text-right"
                                    />
                                </div>
                            </div>

                            <Separator />
                        </div>

                        {/* Footer with Dialog Style */}
                        <div className="px-4 pt-6 border-t-3 border-dotted flex justify-end gap-3 bg-white/50 dark:bg-[#1a1a1a] dark:border-white/10 backdrop-blur-xl">
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                onClick={handleSaveProfile}
                                className="text-xs"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Danger Zone Card with Dialog Styling */}
                    <div className="p-0 gap-0 rounded-md  bg-white/70 dark:bg-zinc-900/50 border border-gray-200 dark:border-[#2a2a2a] overflow-hidden h-max">
                        {/* Header with Dialog Style */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-white/60 dark:bg-[#1a1a1a] backdrop-blur-xl">
                            <div className="flex gap-3 items-center pt-3">
                                <div className="border bg-red-100 dark:bg-red-900/20 rounded-sm p-2">
                                    <Trash2 className="text-red-600 dark:text-red-400" size={20} />
                                </div>
                                <div className="flex flex-col gap-[3px]">
                                    <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                                        Danger Zone
                                    </h3>
                                    <div className="text-xs font-medium text-gray-800 dark:text-gray-400">
                                        Irreversible actions for your account
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content with Dialog Style */}
                        <div className="px-4 py-4 bg-white/40 dark:bg-[#1a1a1a] space-y-4">
                            <Alert className="dark:bg-red-900/20 bg-red-300/40  ">
                                <AlertDescription className=" text-red-400 ">
                                    Warning: Account deletion is permanent and cannot be undone. All your data will be lost.
                                </AlertDescription>
                            </Alert>

                            <div className=" p-4 rounded-lg border ">
                                <div className="font-semibold  mb-2">Delete Account</div>
                                <div className="text-sm text-gray-900 dark:text-slate-300 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </div>
                                <Button
                                    size={'sm'}
                                    variant="outline"
                                    className='text-xs  p-3 flex items-center gap-2'
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="" />
                                    Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonDialog
                icon={<Trash2 className="text-red-400" size={20} />}
                note="This action cannot be undone"
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) {
                        setDeleteConfirmEmail('');
                        setEmailError('');
                    }
                }}
                title="Delete Account"
                footer={
                    <CommonDialogFooter
                        onCancel={() => {
                            setIsDeleteDialogOpen(false);
                            setDeleteConfirmEmail('');
                        }}
                        onConfirm={handleDeleteAccount}
                        cancelText="Cancel"
                        confirmText={isDeleting ? "Deleting..." : "Delete Account"}
                        confirmVariant="destructive"
                        confirmDisabled={deleteConfirmEmail !== profileData.email || isDeleting}
                    />
                }
            >
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Your account{" "}
                        <strong className="text-red-400">{profileData.email}</strong> and all associated
                        data will be permanently deleted.
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-email" className="text-sm font-medium">
                            Type your email to confirm
                        </Label>
                        <Input
                            id="confirm-email"
                            type="email"
                            placeholder={'Enter your email'}
                            value={deleteConfirmEmail}
                            onChange={(e) => {
                                const value = e.target.value;
                                setDeleteConfirmEmail(value);

                            }}
                        />

                    </div>
                </div>
            </CommonDialog>
        </div>
    );
}