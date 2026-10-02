import { IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { assetUrl } from "../../../helpers/apiHelper";
import {
  STATUS_LABEL,
  extractRows,
  formatDate,
  pct,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import AddModal from "../modals/AddModal";
import {
  asyncChangeLostFound,
  asyncDeleteLostFound,
  asyncGetLostFoundStats,
  asyncGetLostFounds,
  setIsLostFoundAddedActionCreator,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";

const selectClass = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

function StatList({ title, data }) {
  const rows = extractRows(data);
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h4 className="mb-2 font-semibold">{title}</h4>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada data.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {rows.map((row, i) => (
            <li key={i}>{Object.values(row).join(" · ")}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const lostFounds = useSelector((s) => s.lostFounds);
  const isLoading = useSelector((s) => s.isLostFound);
  const isAdded = useSelector((s) => s.isLostFoundAdded);
  const isChanged = useSelector((s) => s.isLostFoundChanged);
  const isDeleted = useSelector((s) => s.isLostFoundDeleted);
  const stats = useSelector((s) => s.lostFoundStats);

  const [isMe, setIsMe] = useState(false);
  const [status, setStatus] = useState("all");
  const [completed, setCompleted] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, onKeyword] = useInput();
  const { hash } = useLocation();

  const load = useCallback(
    () => dispatch(asyncGetLostFounds(isMe ? { is_me: 1 } : {})),
    [dispatch, isMe]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    dispatch(asyncGetLostFoundStats());
  }, [dispatch]);

  useEffect(() => {
    if (isAdded) {
      dispatch(setIsLostFoundAddedActionCreator(false));
      setShowAdd(false);
      load();
    }
  }, [isAdded, dispatch, load]);

  // Aksi cepat dari kartu (tandai selesai / hapus) selesai: reset flag, muat ulang
  useEffect(() => {
    if (isChanged || isDeleted) {
      dispatch(setIsLostFoundChangedActionCreator(false));
      dispatch(setIsLostFoundDeletedActionCreator(false));
      load();
    }
  }, [isChanged, isDeleted, dispatch, load]);

  // Menu "Statistik" pada sidebar mengarah ke #statistik: gulir ke bagian tersebut
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  const onToggleCompleted = (item) =>
    dispatch(
      asyncChangeLostFound(item.id, {
        title: item.title,
        description: item.description,
        status: item.status,
        is_completed: item.is_completed === 1 ? 0 : 1,
      })
    );

  const onDelete = async (item) => {
    if (await showConfirmDialog(`Hapus laporan "${item.title}"?`, "Hapus")) {
      dispatch(asyncDeleteLostFound(item.id));
    }
  };

  const kw = keyword.toLowerCase();
  const filtered = lostFounds.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      (completed === "all" || String(item.is_completed) === completed) &&
      item.title.toLowerCase().includes(kw)
  );

  const summary = [
    ["Total", lostFounds.length],
    ["Barang Hilang", lostFounds.filter((i) => i.status === "lost").length],
    ["Barang Ditemukan", lostFounds.filter((i) => i.status === "found").length],
    ["Selesai", lostFounds.filter((i) => i.is_completed === 1).length],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Laporan Lost &amp; Found</h2>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
          <IconPlus size={18} /> Tambah Laporan
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-extrabold">{value}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-500"
                style={{ width: `${pct(value, lostFounds.length)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={keyword} onChange={onKeyword} placeholder="Cari judul laporan..."
          className="min-w-52 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <select aria-label="Filter status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="all">Semua jenis</option>
          <option value="lost">Hilang</option>
          <option value="found">Ditemukan</option>
        </select>
        <select aria-label="Filter penyelesaian" value={completed} onChange={(e) => setCompleted(e.target.value)} className={selectClass}>
          <option value="all">Semua status</option>
          <option value="0">Belum selesai</option>
          <option value="1">Selesai</option>
        </select>
        <select aria-label="Filter kepemilikan" value={isMe ? "me" : "all"} onChange={(e) => setIsMe(e.target.value === "me")} className={selectClass}>
          <option value="all">Semua laporan</option>
          <option value="me">Laporan saya</option>
        </select>
      </div>

      {isLoading && <p className="text-slate-500">Memuat data...</p>}
      {filtered.length === 0 ? (
        <p className="text-slate-500">Tidak ada laporan ditemukan.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
              <Link to={`/lost-founds/${item.id}`} className="block">
                {item.cover ? (
                  <img src={assetUrl(item.cover)} alt={item.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">Tanpa cover</div>
                )}
                <div className="space-y-1 p-4">
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-700">{STATUS_LABEL[item.status]}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {item.is_completed === 1 ? "Selesai" : "Belum selesai"}
                    </span>
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                  <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                </div>
              </Link>
              <div className="flex gap-2 border-t border-slate-100 p-3 text-sm font-semibold">
                <button onClick={() => onToggleCompleted(item)}
                  className="flex-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50">
                  {item.is_completed === 1 ? "Buka Kembali" : "Tandai Selesai"}
                </button>
                <button onClick={() => onDelete(item)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50">
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section id="statistik" className="grid gap-4 md:grid-cols-2">
        <StatList title="Statistik Harian" data={stats.daily} />
        <StatList title="Statistik Bulanan" data={stats.monthly} />
      </section>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
