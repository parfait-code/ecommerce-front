// low-stock-widget.tsx
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { AlertTriangle } from "lucide-react";

const lowStockItems = [
  { id: 1, name: "Casquette noire", sku: "CAP-001", qty: 3, threshold: 10 },
  { id: 2, name: "Sac à dos", sku: "BAG-012", qty: 5, threshold: 15 },
  { id: 3, name: "T-shirt XL", sku: "TSH-045", qty: 2, threshold: 20 },
  { id: 4, name: "Chaussures 42", sku: "SHO-089", qty: 1, threshold: 8 },
  { id: 5, name: "Ceinture cuir", sku: "BLT-003", qty: 4, threshold: 10 },
];

export function LowStockWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocks critiques</CardTitle>
        <Badge variant="danger">
          <AlertTriangle size={10} className="mr-1" />
          {lowStockItems.length}
        </Badge>
      </CardHeader>
      <div className="space-y-2">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg p-2.5 hover:bg-(--bg-hover) transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-(--text-primary)">
                {item.name}
              </p>
              <p className="text-xs text-(--text-muted)">{item.sku}</p>
            </div>
            <div className="ml-3 flex items-center gap-2">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-(--border)">
                <div
                  className="h-full rounded-full bg-(--danger)"
                  style={{ width: `${(item.qty / item.threshold) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-semibold text-(--danger)">
                {item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}