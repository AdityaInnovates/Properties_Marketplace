'use client';

import { Link } from '@inertiajs/react';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Validation Error');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
        }

        setTimeout(() => {
            toast.success("Thank you for your message. We'll get back to you soon.");

            setLoading(false);

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
            router.visit(route('home'));
        }, 1500);
    };

    return (
        <Layout title="Contact Us">
            <div className="container mx-auto px-4 py-8">
                <Link href={route('home')} className="text-primary mb-6 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <Card className="mx-auto max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                            <Mail className="text-primary h-6 w-6" />
                        </div>
                        <CardTitle>Contact Us</CardTitle>
                        <CardDescription>
                            Have questions about a property or need assistance? Send us a message and our team will get back to you.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]">
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message *</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your message..."
                                    rows={5}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" type="button" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}

export default ContactPage;
