'use client';

import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Badge, Bookmark, BookMarkedIcon, Filter, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Slider } from '../components/ui/slider';

function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentBookmarkedProperties, setcurrentBookmarkedProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [activeFilters, setActiveFilters] = useState(0);
    useEffect(() => {
        var currentBookmarkedProperties = JSON.parse(localStorage.getItem('bookmarked_properties')) || [];
        setcurrentBookmarkedProperties(currentBookmarkedProperties);
    }, []);
    const propertyTypes = [
        { id: 'apartment', label: 'Apartment' },
        { id: 'house', label: 'House' },
        { id: 'villa', label: 'Villa' },
        { id: 'cabin', label: 'Cabin' },
        { id: 'townhouse', label: 'Townhouse' },
    ];

    // Bedroom options
    const bedroomOptions = [
        { id: '1', label: '1 Bedroom' },
        { id: '2', label: '2 Bedrooms' },
        { id: '3', label: '3 Bedrooms' },
        { id: '4', label: '4+ Bedrooms' },
    ];
    const [filters, setFilters] = useState({
        priceRange: [0, 2000000],
        propertyTypes: [],
        bedrooms: [],
        showBookmarkedOnly: false,
        searchQuery: '',
    });
    const resetFilters = () => {
        setFilters({
            priceRange: [0, 2000000],
            propertyTypes: [],
            bedrooms: [],
            showBookmarkedOnly: false,
            searchQuery: '',
        });
    };
    useEffect(() => {
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) count++;
        if (filters.propertyTypes.length > 0) count++;
        if (filters.bedrooms.length > 0) count++;
        if (filters.showBookmarkedOnly) count++;
        if (filters.searchQuery) count++;
        setActiveFilters(count);
    }, [filters]);
    const formatPrice = (price) => {
        return `$${price.toLocaleString()}`;
    };
    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };
    const applyFilters = (allProperties) => {
        let result = [...allProperties];

        result = result.filter((property) => property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]);

        if (filters.propertyTypes.length > 0) {
            // console.log(filters.propertyTypes);
            // console.log(result.map((property) => property?.description?.toLowerCase()));
            // result = result.filter((property) => {
            //     const description = property?.description?.toLowerCase();
            //     return filters.propertyTypes.some((type) => description.includes(type.toLowerCase()));
            // });
        }

        if (filters.bedrooms.length > 0) {
            result = result.filter((property) => {
                if (filters.bedrooms.includes('4') && property.bedrooms >= 4) {
                    return true;
                }
                return filters.bedrooms.includes(property.bedrooms.toString());
            });
        }

        if (filters.showBookmarkedOnly) {
            result = result.filter((property) => currentBookmarkedProperties.includes(property.id));
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(
                (property) =>
                    property.title.toLowerCase().includes(query) ||
                    property.address.toLowerCase().includes(query) ||
                    property.description.toLowerCase().includes(query),
            );
        }

        return result;
    };

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                var { data: axres } = await axios.get('/api/properties?page=' + currentPage);
                setProperties(axres.data);
                const filtered = applyFilters(axres.data);
                setFilteredProperties(filtered);
                setTotalPages(Math.ceil(axres.total / axres.per_page));
            } catch (error) {
                console.log(error?.response?.data?.message);
            }
            setLoading(false);
        };

        fetchProperties();
    }, [currentPage, filters, currentBookmarkedProperties]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };

    if (loading && properties.length === 0) {
        return (
            <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-8">
                <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                <p>Loading properties...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={route('home')} className="text-primary mb-6 flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold">Property Listings</h1>
                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search properties..."
                            className="pl-8"
                            value={filters.searchQuery}
                            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        />
                        {filters.searchQuery && (
                            <button
                                onClick={() => handleFilterChange('searchQuery', '')}
                                className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    {
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                    {activeFilters > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                            {activeFilters}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md">
                                <SheetHeader>
                                    <SheetTitle>Filter Properties</SheetTitle>
                                    <SheetDescription>Refine your property search with these filters.</SheetDescription>
                                </SheetHeader>
                                <div className="mx-[1rem] grid gap-6 py-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm leading-none font-medium">Price Range</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{formatPrice(filters.priceRange[0])}</span>
                                            <span className="text-sm">{formatPrice(filters.priceRange[1])}</span>
                                        </div>
                                        <Slider
                                            defaultValue={[0, 2000000]}
                                            min={0}
                                            max={2000000}
                                            step={50000}
                                            value={filters.priceRange}
                                            onValueChange={(value) => handleFilterChange('priceRange', value)}
                                        />
                                    </div>

                                    {/* <div className="space-y-4">
                                    <h3 className="text-sm leading-none font-medium">Property Type</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {propertyTypes.map((type) => (
                                            <div key={type.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${type.id}`}
                                                    checked={filters.propertyTypes.includes(type.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            handleFilterChange('propertyTypes', [...filters.propertyTypes, type.id]);
                                                        } else {
                                                            handleFilterChange(
                                                                'propertyTypes',
                                                                filters.propertyTypes.filter((id) => id !== type.id),
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                    {/* <div className="space-y-4">
                                    <h3 className="text-sm leading-none font-medium">Bedrooms</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {bedroomOptions.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`bedroom-${option.id}`}
                                                    checked={filters.bedrooms.includes(option.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            handleFilterChange('bedrooms', [...filters.bedrooms, option.id]);
                                                        } else {
                                                            handleFilterChange(
                                                                'bedrooms',
                                                                filters.bedrooms.filter((id) => id !== option.id),
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`bedroom-${option.id}`}>{option.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="bookmarked"
                                                checked={filters.showBookmarkedOnly}
                                                onCheckedChange={(checked) => {
                                                    handleFilterChange('showBookmarkedOnly', !!checked);
                                                }}
                                            />
                                            <Label htmlFor="bookmarked">Show bookmarked properties only</Label>
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className="flex flex-row gap-3 sm:justify-between">
                                    <Button variant="outline" onClick={resetFilters}>
                                        Reset Filters
                                    </Button>
                                    <SheetClose>
                                        <Button onClick={() => applyFilters(properties)}>Apply Filters</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    }
                    <Link href={route('properties.create')}>
                        <Button>Create New Listing</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                    <div key={property.id} onClick={() => router.visit(route('properties.show', property.id))}>
                        <Card className="transition-300 h-full transition-all duration-300 hover:bg-[rgba(38,38,38,0.3)] hover:shadow-md">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                                    <div className="cursor-pointer">
                                        {currentBookmarkedProperties.includes(property.id) ? (
                                            <BookMarkedIcon
                                                onClick={(el) => {
                                                    el.stopPropagation();
                                                    var currentBookmarkedProperties = JSON.parse(localStorage.getItem('bookmarked_properties')) || [];
                                                    currentBookmarkedProperties = currentBookmarkedProperties.filter((el) => el != property.id);
                                                    localStorage.setItem('bookmarked_properties', JSON.stringify(currentBookmarkedProperties));
                                                    setcurrentBookmarkedProperties(currentBookmarkedProperties);
                                                }}
                                            />
                                        ) : (
                                            <Bookmark
                                                onClick={(el) => {
                                                    el.stopPropagation();
                                                    var currentBookmarkedProperties = JSON.parse(localStorage.getItem('bookmarked_properties')) || [];
                                                    currentBookmarkedProperties.push(property.id);
                                                    localStorage.setItem('bookmarked_properties', JSON.stringify(currentBookmarkedProperties));
                                                    setcurrentBookmarkedProperties(currentBookmarkedProperties);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-2xl font-bold">${property.price.toLocaleString()}</p>
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

            <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} onClick={() => handlePageChange(page)}>
                            {page}
                        </Button>
                    ))}

                    <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </nav>
            </div>
        </div>
    );
}

export default PropertiesPage;
