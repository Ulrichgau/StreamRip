import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Mp3Result {
  id: string;
  filename: string;
  url: string;
  source: string;
}

interface Mp3ResultItemProps {
  result: Mp3Result;
}

export function Mp3ResultItem({ result }: Mp3ResultItemProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "URL ready for wget",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4" data-testid={`card-mp3-${result.id}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate" data-testid={`text-filename-${result.id}`}>
              {result.filename}
            </h3>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-source-${result.id}`}>
              {result.source}
            </Badge>
          </div>
          <p className="text-sm font-mono text-muted-foreground break-all" data-testid={`text-url-${result.id}`}>
            {result.url}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          data-testid={`button-copy-${result.id}`}
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
