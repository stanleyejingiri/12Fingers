// src/pages/WorkerVerification.tsx
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Shield } from "lucide-react";

export default function WorkerVerification() {
  const { user } = useAuth();
  const { worker } = useWorkerProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    legal_name: "",
    id_number: "",
    id_type: "passport",
    business_name: "",
    business_type: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker?.id) {
      toast({ title: "Error", description: "Worker profile not found", variant: "destructive" });
      return;
    }

    if (!formData.legal_name || !formData.id_number || !documentFile) {
      toast({ title: "Missing Information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const data = new FormData();
    data.append("worker_id", worker.id);
    data.append("legal_name", formData.legal_name);
    data.append("id_number", formData.id_number);
    data.append("id_type", formData.id_type);
    if (formData.business_name) data.append("business_name", formData.business_name);
    if (formData.business_type) data.append("business_type", formData.business_type);
    if (documentFile) data.append("document", documentFile);

    try {
      setLoading(true);
      const response = await fetch("https://one2fingers-backend.onrender.com/api/verification/request", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed");
      toast({ title: "Success", description: "Verification request submitted. We'll review it soon." });
      navigate("/worker-dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return <div>Loading...</div>;
  if (worker.is_verified) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Already Verified</h2>
            <p className="text-gray-600 mb-4">Your account is already verified.</p>
            <Button asChild>
              <Link to="/worker-dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Verification Request</CardTitle>
          <CardDescription>
            Please provide the following information to verify your identity. This helps build trust with clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="legal_name">Full Legal Name (as on ID) *</Label>
              <Input
                id="legal_name"
                name="legal_name"
                value={formData.legal_name}
                onChange={handleChange}
                placeholder="John A. Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_type">ID Type *</Label>
              <Select value={formData.id_type} onValueChange={(v) => handleSelectChange("id_type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="national_id">National ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_number">ID Number *</Label>
              <Input
                id="id_number"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                placeholder="e.g., A1234567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Upload ID Document (image or PDF) *</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <Input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Business Information (Optional)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business / Company Name</Label>
                  <Input
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="e.g., John's Handyman Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    placeholder="e.g., Sole Proprietorship, LLC"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Verification Request"}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Your information will be kept confidential and used only for verification purposes.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
