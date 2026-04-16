import { ResourceCard } from "@/components/ResourceCard";
import { BookOpen, Layers, FileText, GraduationCap, Newspaper, Settings, Palette, Camera, Video, Box, Share2 } from "lucide-react";

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
          <ResourceCard icon={Share2} name="SharePoint" href="https://mybestseller.sharepoint.com/teams/GraphicalMACsupport" />
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
        <h3 className="text-sm font-bold text-foreground mb-3">Knowledge & Communities</h3>
        <div className="grid grid-cols-3 gap-4">
          <ResourceCard icon={GraduationCap} name="Creative Tips / Teams" href="https://teams.microsoft.com/l/team/19%3Afd50497890d24f0e95c75e399f6505fe%40thread.tacv2/conversations?groupId=f56e6502-0338-4ecf-a654-3f7c3bd09b56&tenantId=98db9fb9-f52b-4e63-83d9-795ccd2dfcca" />
          <ResourceCard icon={FileText} name="GenAI Media Community / Teams" href="https://teams.microsoft.com/l/team/19%3A3DuBwwPbsM4cV-f1wlR6hIWw9TnjEMZdLFhQZsUtsdA1%40thread.tacv2/conversations?groupId=0f48ef5f-0bf0-4402-866c-e016d3357d85&tenantId=98db9fb9-f52b-4e63-83d9-795ccd2dfcca" />
          <ResourceCard icon={Newspaper} name="Creative Force / Teams" href="https://teams.microsoft.com/l/team/19%3ArQDrAcBDAhDGxrzKlW2arcowXixz27VSDfqpJAyIOO01%40thread.tacv2/conversations?groupId=3b7825ae-3f9c-41e7-99fb-5a5c987667ef&tenantId=98db9fb9-f52b-4e63-83d9-795ccd2dfcca" />
        </div>
      </div>
    </div>
  );
}
