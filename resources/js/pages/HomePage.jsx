import { Link } from '@inertiajs/react';
import { Building, Home, Plus } from 'lucide-react';

function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
                <Building className="text-primary h-16 w-16" />
                <h1 className="text-3xl font-bold tracking-tight">Property Listing & Agent Matching</h1>
                <p className="text-muted-foreground max-w-[600px]">
                    Browse available properties or create new listings with AI-powered property matching
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link
                    href={route('properties')}
                    className="flex flex-col items-center justify-center rounded-lg border p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                    <Home className="text-primary mb-4 h-12 w-12" />
                    <h2 className="text-xl font-semibold">Browse Properties</h2>
                    <p className="text-muted-foreground mt-2 text-center">View all available property listings</p>
                </Link>

                <Link
                    href={route('properties.create')}
                    className="flex flex-col items-center justify-center rounded-lg border p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                    <Plus className="text-primary mb-4 h-12 w-12" />
                    <h2 className="text-xl font-semibold">Create Listing</h2>
                    <p className="text-muted-foreground mt-2 text-center">Add a new property listing to the marketplace</p>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
