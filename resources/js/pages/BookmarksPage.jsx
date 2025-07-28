'use client';

import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { BookMarkedIcon, Heart, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import withAuth from '../hoc/withAuth';

function BookmarksPage() {
    const [properties, setProperties] = useState([]);
    const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarked_properties')) || [];
        setBookmarkedProperties(bookmarkedIds);
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const { data: axres } = await axios.get('/api/properties?page=' + currentPage);
                setProperties(axres.data);

                const bookmarkedOnly = axres.data.filter((property) => bookmarkedProperties.includes(property.id));

                setFilteredProperties(bookmarkedOnly);
                setTotalPages(Math.ceil(bookmarkedOnly.length / axres.per_page));
            } catch (error) {
                console.log(error?.response?.data?.message);
            }
            setLoading(false);
        };

        if (bookmarkedProperties.length > 0) {
            fetchProperties();
        } else {
            setLoading(false);
            setFilteredProperties([]);
        }
    }, [currentPage, bookmarkedProperties]);

    useEffect(() => {
        if (!searchQuery) {
            const bookmarkedOnly = properties.filter((property) => bookmarkedProperties.includes(property.id));
            setFilteredProperties(bookmarkedOnly);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = properties.filter(
                (property) =>
                    bookmarkedProperties.includes(property.id) &&
                    (property.title.toLowerCase().includes(query) ||
                        property.address.toLowerCase().includes(query) ||
                        property.description.toLowerCase().includes(query)),
            );
            setFilteredProperties(filtered);
        }
    }, [searchQuery, properties, bookmarkedProperties]);

    const handleRemoveBookmark = (propertyId, event) => {
        event.stopPropagation();
        const updatedBookmarks = bookmarkedProperties.filter((id) => id !== propertyId);
        setBookmarkedProperties(updatedBookmarks);
        localStorage.setItem('bookmarked_properties', JSON.stringify(updatedBookmarks));

        setFilteredProperties((prev) => prev.filter((property) => property.id !== propertyId));
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };

    if (loading) {
        return (
            <Layout title="My Bookmarks">
                <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-8">
                    <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                    <p>Loading bookmarked properties...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="My Bookmarks">
            <div className="container mx-auto px-4 py-8">
                {/* <Link href={route('home')} className="text-primary mb-6 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link> */}

                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Heart className="text-primary h-6 w-6" />
                        <h1 className="text-2xl font-bold">My Bookmarked Properties</h1>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search bookmarked properties..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link href={route('properties')}>
                            <Button variant="outline">Browse All Properties</Button>
                        </Link>
                    </div>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                        <Heart className="text-muted-foreground mb-4 h-16 w-16" />
                        <h2 className="mb-2 text-xl font-semibold">No Bookmarked Properties</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            {bookmarkedProperties.length === 0
                                ? "You haven't bookmarked any properties yet. Start browsing to save your favorites!"
                                : 'No bookmarked properties match your search criteria.'}
                        </p>
                        <Link href={route('properties')}>
                            <Button>Browse Properties</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-muted-foreground mb-4 text-sm">
                            Showing {filteredProperties.length} bookmarked {filteredProperties.length === 1 ? 'property' : 'properties'}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProperties.map((property) => (
                                <div key={property.id} onClick={() => router.visit(route('properties.show', property.id))}>
                                    <Card className="transition-300 h-full cursor-pointer transition-all duration-300 hover:bg-[rgba(38,38,38,0.3)] hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                                                <div className="cursor-pointer">
                                                    <BookMarkedIcon
                                                        className="text-primary h-5 w-5"
                                                        onClick={(e) => handleRemoveBookmark(property.id, e)}
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {/* <div className="bg-muted mb-4 flex aspect-video items-center justify-center rounded-md">
                                                <div className="text-muted-foreground">Property Image</div>
                                            </div> */}
                                            <p className="mb-2 text-2xl font-bold">₹{property.price.toLocaleString('en-IN')}</p>
                                            <p className="text-muted-foreground mb-2">{property.address}</p>
                                            <p className="line-clamp-3">{property.description}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p className="text-muted-foreground text-sm">Listed on {new Date(property.created_at).toDateString()}</p>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                        Previous
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Next
                                    </Button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}

export default withAuth(BookmarksPage);
