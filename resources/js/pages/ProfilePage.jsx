'use client';

import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Building, Camera, Edit, Heart, Loader2, Mail, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../hoc/withAuth';

function ProfilePage() {
    const { user } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [userProperties, setUserProperties] = useState([]);
    const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        location: '',
    });

    const [profileErrors, setProfileErrors] = useState({});

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        if (!user?.email) return;

        try {
            setLoadingProperties(true);
            const [propertiesRes, profileRes] = await Promise.all([
                axios.get('/api/properties'),
                axios.get('/api/profile', {
                    params: { email: user.email },
                }),
            ]);

            setUserProperties(propertiesRes.data.data || []);

            const profileData = profileRes.data.user;
            setProfileData({
                name: profileData.name || user.displayName || user.email || '',
                email: profileData.email || user.email || '',
                bio: profileData.bio || '',
                phone: profileData.phone || '',
                location: profileData.location || '',
            });

            const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarked_properties')) || [];
            const bookmarked = propertiesRes.data.data.filter((property) => bookmarkedIds.includes(property.id));
            setBookmarkedProperties(bookmarked);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (user) {
                setProfileData({
                    name: user.displayName || user.email || '',
                    email: user.email || '',
                    bio: '',
                    phone: '',
                    location: '',
                });
            }
        } finally {
            setLoadingProperties(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileErrors({});

        try {
            const response = await axios.put('/api/profile', {
                ...profileData,
                email: user.email,
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                setIsEditingProfile(false);
                setProfileData(response.data.user);
            } else {
                throw new Error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);

            if (error.response?.data?.errors) {
                setProfileErrors(error.response.data.errors);
                toast.error('Please fix the validation errors and try again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getProfileCompletion = () => {
        const fields = [profileData.name, profileData.email, profileData.bio, profileData.phone, profileData.location];
        const filledFields = fields.filter((field) => field && field.trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    };

    return (
        <Layout title="Profile">
            <div className="container mx-auto px-4 py-8">
                <Link href={route('home')} className="text-primary mb-6 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Profile Information
                                        </CardTitle>
                                        <CardDescription>Manage your account's profile information and personal details.</CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                                        disabled={loadingProfile}
                                    >
                                        {isEditingProfile ? (
                                            'Cancel'
                                        ) : (
                                            <>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>

                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarFallback className="text-lg">{getInitials(profileData.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <Button variant="outline" size="sm" className="gap-2" disabled>
                                                <Camera className="h-4 w-4" />
                                                Change Photo
                                            </Button>
                                            <p className="text-muted-foreground mt-1 text-sm">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter your full name"
                                            />
                                            {profileErrors.name && <p className="text-destructive text-sm">{profileErrors.name[0]}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter your email"
                                            />
                                            {profileErrors.email && <p className="text-destructive text-sm">{profileErrors.email[0]}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter your phone number"
                                            />
                                            {profileErrors.phone && <p className="text-destructive text-sm">{profileErrors.phone[0]}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                                                disabled={!isEditingProfile}
                                                placeholder="Enter your location"
                                            />
                                            {profileErrors.location && <p className="text-destructive text-sm">{profileErrors.location[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                                            disabled={!isEditingProfile}
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                        />
                                        {profileErrors.bio && <p className="text-destructive text-sm">{profileErrors.bio[0]}</p>}
                                    </div>
                                </CardContent>

                                {isEditingProfile && (
                                    <CardFooter>
                                        <Button type="submit" disabled={loadingProfile}>
                                            {loadingProfile ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                )}
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Account Activity</CardTitle>
                                <CardDescription>Your activity and statistics on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Properties Listed</span>
                                            <span className="font-medium">{userProperties.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bookmarked Properties</span>
                                            <span className="font-medium">{bookmarkedProperties.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Profile Completion</span>
                                            <span className="font-medium">{getProfileCompletion()}%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Member Since</span>
                                            <span className="font-medium">
                                                {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Active</span>
                                            <span className="font-medium">
                                                {user?.metadata?.lastSignInTime
                                                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                                                    : 'Today'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Email Status</span>
                                            <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                                                {user?.emailVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Bookmarks</CardTitle>
                                        <CardDescription>Properties you've recently bookmarked</CardDescription>
                                    </div>
                                    <Link href={route('bookmarks')}>
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingProperties ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : bookmarkedProperties.length > 0 ? (
                                    <div className="space-y-3">
                                        {bookmarkedProperties.slice(0, 3).map((property) => (
                                            <div key={property.id} className="rounded-lg border p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="line-clamp-1 font-medium">{property.title}</h4>
                                                        <p className="text-muted-foreground text-sm">{property.address}</p>
                                                        <p className="text-sm font-semibold">₹{property.price.toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <Link href={route('properties.show', property.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <Heart className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                        <p className="text-muted-foreground text-sm">No bookmarked properties yet</p>
                                        <Link href={route('properties')}>
                                            <Button size="sm" className="mt-2">
                                                Browse Properties
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Account Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <Avatar className="mx-auto mb-3 h-16 w-16">
                                        <AvatarFallback className="text-xl">{getInitials(profileData.name)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-medium">{profileData.name || 'User'}</h3>
                                    <p className="text-muted-foreground text-sm">{profileData.email}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Profile Completion</span>
                                        <span className="font-medium">{getProfileCompletion()}%</span>
                                    </div>
                                    <div className="bg-secondary h-2 w-full rounded-full">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${getProfileCompletion()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">My Properties</CardTitle>
                                    <Link href={route('properties.create')}>
                                        <Button size="sm" variant="outline">
                                            <Building className="mr-2 h-4 w-4" />
                                            Add New
                                        </Button>
                                    </Link>
                                </div>
                                <CardDescription>Properties you've listed</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingProperties ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : userProperties.length > 0 ? (
                                    <div className="space-y-3">
                                        {userProperties.slice(0, 3).map((property) => (
                                            <div key={property.id} className="rounded-lg border p-3">
                                                <h4 className="line-clamp-1 font-medium">{property.title}</h4>
                                                <p className="text-muted-foreground text-sm">₹{property.price.toLocaleString('en-IN')}</p>
                                                <Link href={route('properties.show', property.id)} className="text-primary text-sm">
                                                    View Details
                                                </Link>
                                            </div>
                                        ))}
                                        {userProperties.length > 3 && (
                                            <Link href={route('properties')} className="text-primary block text-sm">
                                                View all {userProperties.length} properties
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <Building className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                        <p className="text-muted-foreground text-sm">No properties listed yet</p>
                                        <Link href={route('properties.create')}>
                                            <Button size="sm" className="mt-2">
                                                Create First Listing
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="/space-y-2 flex flex-col gap-[0.5rem]">
                                <Link href={route('bookmarks')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Heart className="mr-2 h-4 w-4" />
                                        My Bookmarks
                                    </Button>
                                </Link>
                                <Link href={route('properties')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Building className="mr-2 h-4 w-4" />
                                        Browse Properties
                                    </Button>
                                </Link>
                                <Link href={route('contact')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Contact Support
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default withAuth(ProfilePage);
