import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../../../lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import type { Shipment } from "../../../types";

const mockShipments: Shipment[] = [
  {
    id: "ck_shipment_1",
    orderId: "ck_order_001",
    senderName: "Boutique ABC",
    senderAddress: "10 Av. Kennedy, Yaoundé",
    recipientName: "John Doe",
    recipientAddress: "12 Rue de la Paix, Yaoundé",
    weight: 2.5,
    status: "IN_TRANSIT",
    trackingNumber: "K3J9XQ2P1A",
    estimatedDeliveryDate: "2026-06-22",
    trackingEvents: [],
  },
  {
    id: "ck_shipment_2",
    orderId: "ck_order_002",
    senderName: "Boutique ABC",
    senderAddress: "10 Av. Kennedy, Yaoundé",
    recipientName: "Marie Nkomo",
    recipientAddress: "5 Av. Kennedy, Douala",
    weight: 0.8,
    status: "DELIVERED",
    trackingNumber: "A7B3CD9EF2",
    estimatedDeliveryDate: "2026-06-18",
    trackingEvents: [],
  },
  {
    id: "ck_shipment_3",
    orderId: "ck_order_003",
    senderName: "Boutique ABC",
    senderAddress: "10 Av. Kennedy, Yaoundé",
    recipientName: "Paul Biya",
    recipientAddress: "8 Bd. Indépendance, Bafoussam",
    weight: 5.2,
    status: "PENDING",
    trackingNumber: "P1Q2R3S4T5",
    estimatedDeliveryDate: "2026-06-25",
    trackingEvents: [],
  },
];

const statusMap: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livré", variant: "success" },
  IN_TRANSIT: { label: "En transit", variant: "accent" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulé", variant: "danger" },
};

export default function ShipmentsPage() {
  const columns = [
    {
      key: "trackingNumber",
      label: "Numéro de suivi",
      render: (s: Shipment) => <span className="font-mono text-sm text-[var(--accent)]">{s.trackingNumber}</span>,
    },
    {
      key: "recipient",
      label: "Destinataire",
      render: (s: Shipment) => (
        <div>
          <p className="font-medium text-[var(--text-primary)]">{s.recipientName}</p>
          <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{s.recipientAddress}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (s: Shipment) => {
        const m = statusMap[s.status];
        return <Badge variant={m.variant}>{m.label}</Badge>;
      },
    },
    {
      key: "estimatedDeliveryDate",
      label: "Livraison estimée",
      render: (s: Shipment) => <span className="text-xs text-[var(--text-muted)]">{formatDate(s.estimatedDeliveryDate)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (s: Shipment) => (
        <div className="flex justify-end">
          <Link href={`/shipments/${s.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Expéditions" description={`${mockShipments.length} expéditions`} />
      <DataTable columns={columns} data={mockShipments} keyExtractor={(s) => s.id} emptyMessage="Aucune expédition" />
    </div>
  );
}