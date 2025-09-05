import { useState } from 'react';
import { Student, PREDEFINED_TAGS } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RemarksModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentId: string, rating: number, tags: string[], notes: string) => void;
}

const RemarksModal = ({ student, isOpen, onClose, onSubmit }: RemarksModalProps) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (!student || rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(student.id, rating, selectedTags, notes);
    handleClose();
    toast({
      title: "Success",
      description: "Remark added successfully!",
      variant: "default"
    });
  };

  const handleClose = () => {
    setRating(0);
    setSelectedTags([]);
    setNotes('');
    setHoveredStar(0);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              Add Remark for {student.name}
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Roll Number: {student.rollNumber} | Class {student.class}-{student.section}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Overall Rating <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starNumber = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className="transition-colors"
                    onMouseEnter={() => setHoveredStar(starNumber)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(starNumber)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        starNumber <= (hoveredStar || rating)
                          ? 'fill-warning text-warning'
                          : 'text-muted-foreground hover:text-warning/60'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-sm text-muted-foreground">
                {rating > 0 ? `${rating} out of 5 stars` : 'Click to rate'}
              </span>
            </div>
          </div>

          {/* Predefined Tags */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Behavioral Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary hover:bg-primary-dark'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Selected: {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Additional Notes (Optional)
            </label>
            <Textarea
              placeholder="Add any specific observations, suggestions, or detailed feedback..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="bg-primary hover:bg-primary-dark"
            >
              Submit Remark
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemarksModal;