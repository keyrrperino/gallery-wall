"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Wand2Icon } from "lucide-react";
import { useState } from "react";

export function ProductNameGenerator() {
  const [topic, setTopic] = useState("");

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="topic" className="mb-2 block font-bold">
          Topic
        </label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button className="mt-4 w-full" loading={true}>
          <Wand2Icon className="mr-2 size-4" />
          Generate product names
        </Button>
      </form>

      {[] && (
        <div className="mt-8 grid grid-cols-1 gap-2">
          {[]?.map((name, i) => (
            <div className="rounded-md border bg-muted p-4" key={i}>
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
