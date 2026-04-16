import { ResourceCard } from "@/components/ResourceCard";
import { BookOpen, Layers, FileText, GraduationCap, Newspaper, Settings, Palette, Camera, Video, Box } from "lucide-react";

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
          <ResourceCard icon={Layers} name="Confluence" href="https://bestjira.atlassian.net/wiki/spaces/DIG/overview" />
          <ResourceCard icon={Settings} name="Jira" href="https://bestjira.atlassian.net/jira/software/c/projects/DIG/boards/593" />
          <ResourceCard icon={BookOpen} name="BESTSELLER Self-Service portal" href="https://bestseller.service-now.com/bestsellersp?spa=1" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Vendor admin portals</h3>
        <div className="grid grid-cols-3 gap-4">
          <ResourceCard icon={Palette} name="Adobe Creative Cloud Suite" href="https://adminconsole.adobe.com/75F7381753AC364F0A490D4B@AdobeOrg/overview" />
          <ResourceCard icon={Camera} name="Capture One Studio" href="https://www.captureone.com/en/account" />
          <ResourceCard icon={Video} name="Creative Force" href="https://app.creativeforce.io/settings/studio/general" />
          <ResourceCard icon={Palette} name="Pantone Connect" href="https://licensing.pantone.com/sign-in" />
          <ResourceCard icon={Box} name="Weavy AI" href="https://app.weavy.ai/" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Training & knowledge</h3>
        <div className="grid grid-cols-3 gap-4">
          <ResourceCard icon={GraduationCap} name="Onboarding Guide" href="#" />
          <ResourceCard icon={FileText} name="Training Library" href="#" />
          <ResourceCard icon={Newspaper} name="Release Notes" href="#" />
        </div>
      </div>
    </div>
  );
}
