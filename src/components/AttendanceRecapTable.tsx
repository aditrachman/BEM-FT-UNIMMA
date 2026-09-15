"use client";

import { Attendance, User } from "@/lib/types";

interface AttendanceRecapTableProps {
  data: Array<{
    nama: string;
    status: "Hadir" | "Tidak Hadir" | "Terlambat";
    masuk: string;
    keluar: string;
    ubah: string;
  }>;
}

export default function AttendanceRecapTable({ data }: AttendanceRecapTableProps) {
  const statusStyles: Record<string, string> = {
    Hadir: "bg-green-100 text-green-800",
    "Tidak Hadir": "bg-red-100 text-red-800",
    Terlambat: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full table-fixed divide-y divide-gray-200">
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "11%" }} />
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              Nama
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              Status
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              Masuk
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              Keluar
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              Ubah
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-3 py-3 text-sm text-gray-900 font-medium truncate">{row.nama}</td>
              <td className="px-3 py-3 text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[row.status]}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-3 py-3 text-sm text-gray-500 font-mono truncate">{row.masuk}</td>
              <td className="px-3 py-3 text-sm text-gray-500 font-mono truncate">{row.keluar}</td>
              <td className="px-3 py-3 text-sm text-gray-500 truncate">{row.ubah || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}