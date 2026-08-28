import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center max-w-md">
        <div className="text-[64px] font-semibold text-ink-primary tabular tracking-tight">404</div>
        <h1 className="text-lg font-semibold text-ink-primary mt-1">Page not found</h1>
        <p className="text-sm text-ink-tertiary mt-1.5">The page you're looking for doesn't exist or has been moved. Try the dashboard or use the command palette.</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link to="/dashboard"><Button>Back to overview</Button></Link>
          <Link to="/labour-market"><Button variant="outline">Browse labour market</Button></Link>
        </div>
      </div>
    </div>
  );
}
