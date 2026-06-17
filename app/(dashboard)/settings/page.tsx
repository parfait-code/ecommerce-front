import { PageHeader } from "../../../components/shared/page-header";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Configuration de votre compte" />

      <div className="grid gap-4 max-w-2xl">
        <Card>
          <h2 className="text-sm font-semibold text-(--text-primary) mb-4">Profil</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prénom" placeholder="Jean" />
              <Input label="Nom" placeholder="Dupont" />
            </div>
            <Input label="Email" type="email" placeholder="jean@example.com" />
            <div className="flex justify-end pt-2">
              <Button>Sauvegarder</Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-(--text-primary) mb-4">Sécurité</h2>
          <div className="space-y-3">
            <Input label="Mot de passe actuel" type="password" />
            <Input label="Nouveau mot de passe" type="password" />
            <Input label="Confirmer le mot de passe" type="password" />
            <div className="flex justify-end pt-2">
              <Button>Modifier le mot de passe</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}