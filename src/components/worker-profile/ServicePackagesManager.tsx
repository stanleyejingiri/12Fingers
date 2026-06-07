// src/components/worker-profile/ServicePackagesManager.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface ServicePackage {
  id: number;
  worker_id: string;
  name: string;
  description: string;
  price: number;
  features: string;
  accepts_custom_offers: boolean;
}

interface ServicePackagesManagerProps {
  workerId: string;
}

export const ServicePackagesManager = ({ workerId }: ServicePackagesManagerProps) => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    accepts_custom_offers: true,
  });

  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/packages/worker/${workerId}`);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({ title: "Error", description: "Failed to load service packages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchPackages();
    }
  }, [workerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast({ title: "Error", description: "Name and price are required", variant: "destructive" });
      return;
    }

    try {
      const url = editingId 
        ? `http://localhost:3001/api/packages/${editingId}`
        : "http://localhost:3001/api/packages";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_id: workerId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          features: formData.features,
          accepts_custom_offers: formData.accepts_custom_offers,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save package");

      toast({ title: "Success", description: editingId ? "Package updated" : "Package created" });
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", description: "", price: "", features: "", accepts_custom_offers: true });
      fetchPackages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/packages/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast({ title: "Success", description: "Package deleted" });
      fetchPackages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startEdit = (pkg: ServicePackage) => {
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price.toString(),
      features: pkg.features || "",
      accepts_custom_offers: pkg.accepts_custom_offers,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading service packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Service Packages</h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Package
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Package" : "New Service Package"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard Cleaning"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's included in this package?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="e.g., 2 hours, Includes materials, Satisfaction guaranteed"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="accepts_custom_offers">Allow custom offers</Label>
                <Switch
                  id="accepts_custom_offers"
                  checked={formData.accepts_custom_offers}
                  onCheckedChange={(checked) => setFormData({ ...formData, accepts_custom_offers: checked })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", description: "", price: "", features: "", accepts_custom_offers: true });
                }}>
                  Cancel
                </Button>
                <Button type="submit">Save Package</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Packages List */}
      <div className="grid gap-4">
        {packages.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No service packages yet. Click "Add Package" to create one.
          </div>
        )}
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{pkg.name}</h4>
                    <span className="text-blue-600 font-bold">${pkg.price}</span>
                    {!pkg.accepts_custom_offers && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Fixed price</span>
                    )}
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  )}
                  {pkg.features && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Features: {pkg.features}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(pkg)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};