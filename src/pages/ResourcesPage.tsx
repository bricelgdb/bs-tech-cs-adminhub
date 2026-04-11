import { ResourceCard } from "@/components/ResourceCard";
import { products } from "@/data/products";
import { BookOpen, ExternalLink, Layers, FileText, GraduationCap, Newspaper, Settings } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-page">Team Resources</h1>
        <p className="subtitle-page mt-1">Quick access to internal platforms, admin portals, and training materials</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Internal platforms</h3>
        <div className="grid grid-cols-3 gap-4">
          <ResourceCard icon={Layers} name="Confluence" description="Internal documentation, runbooks, and team knowledge base." linkLabel="Open Confluence" href="https://bestseller.atlassian.net" />
          <ResourceCard icon={Settings} name="Jira" description="Project tracking and issue management for Creative Solutions team." linkLabel="Open Jira" href="https://bestseller.atlassian.net/jira" />
          <ResourceCard icon={BookOpen} name="BESTSELLER Intranet (BSIF)" description="Company-wide intranet for news, policies, and HR resources." linkLabel="Open BSIF" href="https://bsif.bestseller.com" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Vendor admin portals</h3>
        <div className="grid grid-cols-3 gap-4">
          {products.map(p => (
            <ResourceCard key={p.id} icon={ExternalLink} name={p.name} description={`Admin console for ${p.name} — manage seats, settings, and integrations.`} linkLabel="Open admin" href={p.adminUrl} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Training & knowledge</h3>
        <div className="grid grid-cols-3 gap-4">
          <ResourceCard icon={GraduationCap} name="Onboarding Guide" description="Step-by-step onboarding guide for new Creative Solutions team members." linkLabel="Open guide" href="#" />
          <ResourceCard icon={FileText} name="Training Library" description="Self-paced courses and certifications for all creative tools." linkLabel="Browse courses" href="#" />
          <ResourceCard icon={Newspaper} name="Release Notes" description="Changelog and release notes for TECH Creative Solutions platform updates." linkLabel="View changelog" href="#" />
        </div>
      </div>
    </div>
  );
}
