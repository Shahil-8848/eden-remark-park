import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, UserCircle, X } from 'lucide-react';
import { PREDEFINED_TAGS } from '@/types';

interface StudentSearchProps {
  students: any[];
  classes: any[];
}

const StudentSearch = ({ students, classes }: StudentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Get all unique tags from remarks
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    students.forEach(student => {
      student.remarks?.forEach((remark: any) => {
        remark.tags?.forEach((tag: string) => tagsSet.add(tag));
      });
    });
    return Array.from(tagsSet).sort();
  }, [students]);

  // Filter students based on search criteria
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by search term (student name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by class
    if (selectedClass !== 'all') {
      const [classNumber, section] = selectedClass.split('-');
      filtered = filtered.filter(student =>
        student.classes?.number === parseInt(classNumber) &&
        student.classes?.section === section
      );
    }

    // Filter by tags - students must have remarks with ALL selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(student => {
        if (!student.remarks || student.remarks.length === 0) return false;
        
        const studentTags = new Set<string>();
        student.remarks.forEach((remark: any) => {
          remark.tags?.forEach((tag: string) => studentTags.add(tag));
        });
        
        return selectedTags.every(tag => studentTags.has(tag));
      });
    }

    // Sort by average rating (highest first) then by name
    return filtered.sort((a: any, b: any) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return a.name.localeCompare(b.name);
    });
  }, [students, searchTerm, selectedTags, selectedClass]);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedClass('all');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Search</h1>
        <p className="text-muted-foreground">
          Find students by name, class, or remark categories
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Class Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={`${cls.number}-${cls.section}`}>
                      Class {cls.number}-{cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Categories</label>
              <Select onValueChange={addTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Add category filter" />
                </SelectTrigger>
                <SelectContent>
                  {allTags
                    .filter(tag => !selectedTags.includes(tag))
                    .map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Search Results ({filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found matching your criteria. Try adjusting your filters.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{student.name}</h3>
                        <Badge variant="outline">
                          Class {student.classes?.number}-{student.classes?.section}
                        </Badge>
                        <Badge variant="outline">
                          Roll No: {student.roll_number}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Average Rating:</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(student.averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-medium ml-1">
                            {student.averageRating > 0 ? student.averageRating.toFixed(1) : 'N/A'}/5
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({student.remarks?.length || 0} remark{student.remarks?.length !== 1 ? 's' : ''})
                        </span>
                      </div>

                      {/* Recent Remarks */}
                      {student.remarks && student.remarks.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Recent Remarks:</h4>
                          {student.remarks
                            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, 2)
                            .map((remark: any, index: number) => (
                              <div key={index} className="pl-4 border-l-2 border-muted">
                                <div className="flex items-center gap-2 mb-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < remark.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-muted-foreground">
                                    by {remark.profiles?.full_name} • {new Date(remark.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {remark.tags && remark.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-1">
                                    {remark.tags.map((tag: string) => (
                                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {remark.notes && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {remark.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          {student.remarks.length > 2 && (
                            <p className="text-xs text-muted-foreground pl-4">
                              +{student.remarks.length - 2} more remark{student.remarks.length - 2 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSearch;