//src/components/worker-card/WorkerInteractions.tsx
/*import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Flag } from "lucide-react";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { WorkerProfile } from "@/types/worker";

interface WorkerInteractionsProps {
  worker: WorkerProfile;
  onMessageClick: () => void;
}

export function WorkerInteractions({ worker, onMessageClick }: WorkerInteractionsProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onMessageClick}
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowReportDialog(true)}
      >
        <Flag className="h-4 w-4" />
        Report
      </Button>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        workerId={worker.id}
      />
    </div>
  );
}
*/

/*
//src/components/worker-card/WorkerInteractions.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Flag } from "lucide-react";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { WorkerProfile } from "@/types/worker";

interface WorkerInteractionsProps {
  worker: WorkerProfile;
  onMessageClick: () => void;
}

export function WorkerInteractions({ worker, onMessageClick }: WorkerInteractionsProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);

  console.log('🔴 WorkerInteractions rendering for:', worker.name);
  console.log('🔴 onMessageClick function:', typeof onMessageClick);

  const handleMessageClick = () => {
    console.log('🟢 MESSAGE BUTTON CLICKED!');
    console.log('🟢 Worker ID:', worker.id);
    console.log('🟢 Worker User ID:', worker.userId);
    onMessageClick();
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600" // Added distinctive styles
        onClick={handleMessageClick}
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowReportDialog(true)}
      >
        <Flag className="h-4 w-4" />
        Report
      </Button>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        workerId={worker.id}
      />
    </div>
  );
}*/

// TEMPORARY MINIMAL VERSION - WorkerInteractions.tsx
/*import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function WorkerInteractions({ onMessageClick }: any) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => {
          console.log('🟢 SIMPLE MESSAGE BUTTON CLICKED!');
          onMessageClick?.();
        }}
      >
        <MessageSquare className="h-4 w-4" />
        Message TEST
      </Button>
    </div>
  );
}*/

//src/components/worker-card/WorkerInteractions.tsx
import { Button } from "@/components/ui/button";
import { MessageSquare, Flag } from "lucide-react";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { WorkerProfile } from "@/types/worker";
import { useState } from "react";

interface WorkerInteractionsProps {
  worker: WorkerProfile;
  onMessageClick: () => void;
}

export function WorkerInteractions({ worker, onMessageClick }: WorkerInteractionsProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🟢 MESSAGE BUTTON CLICKED - FIXED');
    onMessageClick();
  };

  return (
    <div 
      className="flex gap-2 relative" 
      style={{ position: 'relative', zIndex: 50 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 relative"
        style={{ position: 'relative', zIndex: 100 }}
        onClick={handleMessageClick}
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 relative"
        style={{ position: 'relative', zIndex: 100 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowReportDialog(true);
        }}
      >
        <Flag className="h-4 w-4" />
        Report
      </Button>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        workerId={worker.id}
      />
    </div>
  );
}