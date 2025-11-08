import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Music } from "lucide-react";
import { Mp3ResultItem } from "@/components/Mp3ResultItem";
import { apiRequest } from "@/lib/queryClient";
import type { Mp3Result, ExtractMp3Response } from "@shared/schema";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Mp3Result[]>([]);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (!url.match(/^https?:\/\/.+/)) {
      toast({
        title: "Invalid URL",
        description: "URL must start with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest<ExtractMp3Response>("/api/extract-mp3", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setResults(response.results);
      
      if (response.results.length > 0) {
        toast({
          title: "Extraction Complete",
          description: `Found ${response.results.length} MP3 file${response.results.length !== 1 ? 's' : ''}`,
        });
      } else {
        toast({
          title: "No MP3s Found",
          description: "No MP3 files were found on this webpage",
        });
      }
    } catch (error: any) {
      console.error("Extraction error:", error);
      console.log("Showing error toast with message:", error.message);
      const toastResult = toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract MP3s from the webpage",
        variant: "destructive",
      });
      console.log("Toast called, result:", toastResult);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleExtract();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Music className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">MP3 Stream Extractor</h1>
          </div>
          <p className="text-muted-foreground">
            Extract MP3 stream URLs from any webpage for easy downloading
          </p>
        </header>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="text-sm font-medium mb-2 block">
                Webpage URL
              </label>
              <Input
                id="url-input"
                data-testid="input-url"
                type="url"
                placeholder="https://example.com/podcast"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="font-mono"
              />
            </div>
            <Button
              data-testid="button-extract"
              onClick={handleExtract}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Extract MP3s
                </>
              )}
            </Button>
          </div>
        </Card>

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">
                Found {results.length} MP3 file{results.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="space-y-3">
              {results.map((result) => (
                <Mp3ResultItem key={result.id} result={result} />
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <Card className="p-12 text-center">
            <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Paste a URL above to get started
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
