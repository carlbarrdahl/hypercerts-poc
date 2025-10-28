import { useQuery } from "@tanstack/react-query";
import { kml } from "@tmcw/togeojson";

export function useFetchKML(url: string) {
  return useQuery({
    queryKey: ["kml", url],
    queryFn: () =>
      fetch(`/api/kml?url=${encodeURIComponent(url)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch KML: ${response.status}`);
          }
          return response.text();
        })
        .then((xml) => kml(new DOMParser().parseFromString(xml, "text/xml"))),
    enabled: !!url,
  });
}
