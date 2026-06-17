// page.tsx (AddressesPage)
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import type { Address } from "../../../types";

const mockAddresses: Address[] = [
  { id: "ck_address_1", userId: 1, street: "12 Rue de la Paix", city: "Yaoundé", country: "CM", postalCode: "00237", isDefault: true },
  { id: "ck_address_2", userId: 2, street: "5 Av. Kennedy", city: "Douala", country: "CM", postalCode: "00237", isDefault: false },
  { id: "ck_address_3", userId: 3, street: "8 Bd. de l'Indépendance", city: "Bafoussam", country: "CM", postalCode: "00237", isDefault: false },
];

export default function AddressesPage() {
  const columns = [
    {
      key: "street",
      label: "Adresse",
      render: (a: Address) => (
        <div>
          <p className="font-medium text-(--text-primary)">{a.street}</p>
          <p className="text-xs text-(--text-muted)">{a.city}, {a.country} — {a.postalCode}</p>
        </div>
      ),
    },
    {
      key: "userId",
      label: "Utilisateur",
      render: (a: Address) => <span className="text-(--text-secondary)">User #{a.userId}</span>,
    },
    {
      key: "isDefault",
      label: "Défaut",
      render: (a: Address) =>
        a.isDefault ? <Badge variant="accent">Principale</Badge> : <span className="text-(--text-muted) text-xs">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Adresses" description={`${mockAddresses.length} adresses enregistrées`} />
      <DataTable columns={columns} data={mockAddresses} keyExtractor={(a) => a.id} emptyMessage="Aucune adresse" />
    </div>
  );
}