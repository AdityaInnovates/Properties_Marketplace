'use client';

import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Building, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

function PropertyDetailPage() {
    const { id } = usePage().props;
    const [property, setProperty] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/properties/${id}`);
                setProperty(data);
                setRecommendations(data.recommendations.recommendations || []);
                setError(null);
            } catch (err) {
                setError('Property not found');
                console.error('Error fetching property:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    if (loading) {
        return (
            <Layout title="Property Details">
                <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-8">
                    <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                    <p>Loading property details...</p>
                </div>
            </Layout>
        );
    }

    if (error || !property) {
        return (
            <Layout title="Property Not Found">
                <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-8">
                    <p className="mb-4 text-red-500">{error || 'Property not found'}</p>
                    <Link href={route('properties')}>
                        <Button>Back to Properties</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={property.title}>
            <Head title={property.title} />

            <div className="container mx-auto px-4 py-8">
                <Link href={route('properties')} className="text-primary mb-6 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Properties
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-[1rem]">
                                    <div>
                                        <div className="bg-muted /mb-6 flex aspect-video items-center justify-center rounded-md p-[1.13rem]">
                                            <Building className="text-muted-foreground h-[2.2rem] w-[2.2rem]" />
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">{property.title}</CardTitle>
                                            <CardDescription>{property.address}</CardDescription>
                                        </div>
                                        <div className="text-2xl font-bold">₹{new Intl.NumberFormat('en-IN').format(property.price)}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* <div className="bg-muted mb-6 flex aspect-video items-center justify-center rounded-md">
                                    <Building className="text-muted-foreground h-16 w-16" />
                                </div> */}

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-semibold">Description</h3>
                                        <p>{property.description}</p>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="mb-2 font-semibold">Listed Date</h3>
                                            <p>{new Date(property.created_at).toDateString()}</p>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold">Last Updated</h3>
                                            <p>{new Date(property.updated_at).toDateString()}</p>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold">Agent ID</h3>
                                            <p>{property.agent_id}</p>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold">Property ID</h3>
                                            <p>{property.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Similar Properties</CardTitle>
                                <CardDescription>AI-powered recommendations based on this listing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recommendations.length > 0 ? (
                                    <div className="space-y-4">
                                        {recommendations.map((rec) => (
                                            <div key={rec.id} className="rounded-md border p-4">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <h3 className="font-medium">{rec.title}</h3>
                                                    <Badge variant="outline">{rec.similarity_score}% match</Badge>
                                                </div>
                                                <p className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(rec.price)}</p>
                                                <Link href={route('properties.show', rec.id)} className="text-primary mt-2 block text-sm">
                                                    View property
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No similar properties found</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PropertyDetailPage;
