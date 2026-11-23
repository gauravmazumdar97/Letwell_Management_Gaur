import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SearchFormProps = {
  defaults?: {
    location?: string;
    minRent?: string;
    maxRent?: string;
    bedrooms?: string;
    propertyType?: string;
    sort?: string;
  };
  compact?: boolean;
};

export function SearchForm({ defaults = {}, compact = false }: SearchFormProps) {
  return (
    <form
      action="/search"
      method="get"
      className={
        compact
          ? "grid gap-3 rounded-2xl border border-ink-900/10 bg-white/90 p-4 shadow-sm sm:grid-cols-[1.4fr_auto]"
          : "grid gap-4 rounded-2xl border border-ink-900/10 bg-white/90 p-5 shadow-sm md:grid-cols-2 lg:grid-cols-6"
      }
    >
      <div className={compact ? "" : "lg:col-span-2"}>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Neighbourhood, city or postcode"
          defaultValue={defaults.location ?? ""}
          className="mt-2"
        />
      </div>

      {!compact && (
        <>
          <div>
            <Label htmlFor="minRent">Min rent (£)</Label>
            <Input
              id="minRent"
              name="minRent"
              type="number"
              min={0}
              step={50}
              placeholder="1500"
              defaultValue={defaults.minRent ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="maxRent">Max rent (£)</Label>
            <Input
              id="maxRent"
              name="maxRent"
              type="number"
              min={0}
              step={50}
              placeholder="4000"
              defaultValue={defaults.maxRent ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <select
              id="bedrooms"
              name="bedrooms"
              defaultValue={defaults.bedrooms ?? ""}
              className="mt-2 flex h-11 w-full rounded-md border border-ink-900/15 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div>
            <Label htmlFor="propertyType">Property type</Label>
            <select
              id="propertyType"
              name="propertyType"
              defaultValue={defaults.propertyType ?? ""}
              className="mt-2 flex h-11 w-full rounded-md border border-ink-900/15 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <option value="">Any</option>
              <option value="FLAT">Flat</option>
              <option value="HOUSE">House</option>
              <option value="STUDIO">Studio</option>
              <option value="MAISONETTE">Maisonette</option>
            </select>
          </div>
          <div>
            <Label htmlFor="sort">Sort</Label>
            <select
              id="sort"
              name="sort"
              defaultValue={defaults.sort ?? "newest"}
              className="mt-2 flex h-11 w-full rounded-md border border-ink-900/15 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <option value="newest">Newest</option>
              <option value="rent_asc">Rent: low to high</option>
              <option value="rent_desc">Rent: high to low</option>
            </select>
          </div>
        </>
      )}

      <div className={compact ? "flex items-end" : "lg:col-span-6"}>
        <Button type="submit" className={compact ? "w-full sm:w-auto" : "w-full sm:w-auto"}>
          Search homes
        </Button>
      </div>
    </form>
  );
}
