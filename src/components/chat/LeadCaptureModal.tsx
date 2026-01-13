import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Building2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface LeadInfo {
    name: string;
    email: string;
    phone: string;
    businessType: string;
    reason: string;
}

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (leadInfo: LeadInfo) => void;
    companyName?: string;
    prefillName?: string;
    prefillIndustry?: string;
    submitLabel?: string;
}

const BUSINESS_TYPES = [
    "Home Services (Plumbing, HVAC, etc.)",
    "Medical / Dental",
    "Legal / Professional Services",
    "Restaurant / Hospitality",
    "Real Estate",
    "Marketing / Agency",
    "E-commerce / Retail",
    "Other",
];

const INTEREST_REASONS = [
    "I'm missing too many calls",
    "I need 24/7 customer support",
    "I want to automate lead follow-up",
    "I'm curious about AI for business",
    "Someone referred me",
];

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

const LeadCaptureModal = ({
    isOpen,
    onClose,
    onSubmit,
    companyName = "Conquer365",
    prefillName = "",
    prefillIndustry = "",
    submitLabel = "🎤 Start Voice Call with Kate",
}: LeadCaptureModalProps) => {
    const [formData, setFormData] = useState<LeadInfo>({
        name: prefillName,
        email: "",
        phone: "",
        businessType: prefillIndustry,
        reason: "",
    });
    const [errors, setErrors] = useState<Partial<LeadInfo>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prefill form when props change (e.g., from voice call)
    useEffect(() => {
        if (prefillName || prefillIndustry) {
            setFormData(prev => ({
                ...prev,
                name: prefillName || prev.name,
                businessType: prefillIndustry || prev.businessType,
            }));
        }
    }, [prefillName, prefillIndustry]);

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        const newErrors: Partial<LeadInfo> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (formData.phone.replace(/\D/g, '').length !== 10) {
            newErrors.phone = "Please enter a valid 10-digit US phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof LeadInfo, value: string) => {
        let finalValue = value;

        if (field === 'phone') {
            // Constrain to 10 digits max
            const digits = value.replace(/\D/g, '').slice(0, 10);
            finalValue = formatPhoneNumber(digits);
        }

        setFormData(prev => ({ ...prev, [field]: finalValue }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Before we chat... 👋
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Tell me a bit about yourself!
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="hover:bg-muted"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                Your Name *
                            </Label>
                            <Input
                                id="name"
                                placeholder="John Smith"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Phone *
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={errors.phone ? "border-destructive" : ""}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">{errors.phone}</p>
                            )}
                        </div>

                        {/* Business Type */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                Business Type
                            </Label>
                            <Select
                                value={formData.businessType}
                                onValueChange={(value) => handleChange("businessType", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    {BUSINESS_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reason */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                What brings you here?
                            </Label>
                            <Select
                                value={formData.reason}
                                onValueChange={(value) => handleChange("reason", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent className="z-[100]">
                                    {INTEREST_REASONS.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Connecting..." : submitLabel}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            By continuing, you agree to receive communications from {companyName}.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LeadCaptureModal;
