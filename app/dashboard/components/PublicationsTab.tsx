import React from "react";
import { DocumentTextIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Publication } from "@/types/publication"; // Assuming types are aligned

// Helper to find avatar for author
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAuthorAvatar = (authorName: string, members: any[]) => {
  const member = members.find((m) => m.name === authorName);
  return (
    member?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&size=32`
  );
};

interface PublicationsTabProps {
  publications: Publication[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members?: any[]; // Optional members list for avatar lookup
}

/** Publication with optional display fields (e.g. from API view) */
type PublicationWithDisplay = Publication & {
  authors?: string[];
  link?: string;
  citations?: number;
};

export default function PublicationsTab({
  publications,
  members = [],
}: PublicationsTabProps) {
  if (publications.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No publications found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Publication Title</th>
              <th className="px-6 py-4">Authors</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4 text-center">Year</th>
              <th className="px-6 py-4 text-center">Citations</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(publications as PublicationWithDisplay[]).map((pub) => {
              const authors = pub.authors ?? [];
              const link = pub.link ?? pub.url;
              const citations = pub.citations ?? 0;
              return (
                <tr
                  key={pub.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-start gap-3">
                      <DocumentTextIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{pub.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {/* Avatars based on names */}
                      {authors.slice(0, 3).map((author, i) => (
                        <div
                          key={i}
                          className="inline-block h-6 w-6 rounded-full bg-white ring-2 ring-white"
                          title={author}
                        >
                          <img
                            src={getAuthorAvatar(author, members)}
                            alt={author}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                      ))}
                      {authors.length > 3 && (
                        <div className="flex inline-block h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[8px] font-medium text-gray-500 ring-2 ring-white">
                          +{authors.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{pub.venue}</td>
                  <td className="px-6 py-4 text-center font-medium">
                    {pub.year}
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {citations}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-blue-600 uppercase hover:text-blue-800"
                    >
                      View <LinkIcon className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
