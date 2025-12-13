import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Mail, MapPin, Phone, Save, Settings as SettinsIcon, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';

export const Settings = () => {
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        bio: 'Software developer passionate about creating amazing user experiences.'
    });


    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };


    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };



    return (
        <div className="">
            <div className="">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <SettinsIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Projects Flow</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage and organize your projects
                            </p>
                        </div>
                    </div>

                </div>


                <div className="space-y-6 ">
                    <div className='grid grid-cols-2 gap-3'>
                        <Card className='dark:bg-[#282828] '>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                                    <div className="relative">
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                                        >
                                            <Camera className="w-4 h-4" />
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-semibold text-slate-900 mb-1">
                                            {profileData.firstName} {profileData.lastName}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-3">{profileData.email}</p>
                                        <label htmlFor="photo-upload-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <span className="cursor-pointer">Change Photo</span>
                                            </Button>
                                            <input
                                                id="photo-upload-2"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-slate-500" />
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-slate-500" />
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleProfileChange('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                        Location
                                    </Label>
                                    <Input
                                        id="address"
                                        value={profileData.address}
                                        onChange={(e) => handleProfileChange('address', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-[#282828]  h-max">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for your account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertDescription className="text-red-800">
                                        Warning: Account deletion is permanent and cannot be undone. All your data will be lost.
                                    </AlertDescription>
                                </Alert>

                                <div className="bg-red-00 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 mb-2">Delete Account</h4>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <Button variant="destructive" className="w-full sm:w-auto">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete My Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}