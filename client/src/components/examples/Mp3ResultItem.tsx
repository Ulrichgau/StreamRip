import { Mp3ResultItem } from '../Mp3ResultItem';

export default function Mp3ResultItemExample() {
  const mockResult = {
    id: "1",
    filename: "podcast-episode-42.mp3",
    url: "https://example.com/audio/podcast-episode-42.mp3",
    source: "<audio> tag",
  };

  return <Mp3ResultItem result={mockResult} />;
}
