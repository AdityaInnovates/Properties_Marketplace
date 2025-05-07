'use client';

import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
// import { useToast } from '../hooks/use-toast';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

function CreatePropertyPage() {
    // const { toast } = useToast()
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        agent_id: '1', // Default agent ID for demo purposes
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Validate form
        if (!formData.title || !formData.price || !formData.address) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            setIsProcessing(false);
            return;
        }

        try {
            await axios.post('/api/properties', formData);
            toast.success('Property listing created successfully');
            router.visit(route('properties'));
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={route('properties')} className="text-primary mb-6 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
            </Link>

            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Create New Property Listing</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new property listing. AI will automatically generate similar property recommendations.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Modern Downtown Apartment"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the property in detail..."
                                rows={5}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 450000"
                                    min="0"
                                    step="1000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="agent_id">Agent ID *</Label>
                                <Input
                                    id="agent_id"
                                    name="agent_id"
                                    type="number"
                                    value={formData.agent_id}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g., 123 Main St, Downtown"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="mt-[1.5rem] flex justify-between">
                        <Button variant="outline" type="button" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Property'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default CreatePropertyPage;
