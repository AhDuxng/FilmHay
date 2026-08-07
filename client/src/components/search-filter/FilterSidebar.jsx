export const FilterSidebar = ({ filters, onChange, genres = [], countries = [], years = [] }) => {
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }));
  const reset = () => onChange({
    category: '',
    country: '',
    year: '',
    sort_field: 'modified.time',
    sort_type: 'desc',
  });

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
      <div className="glass-panel rounded-xl p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">Bộ lọc</h2>
          <button type="button" onClick={reset} className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors uppercase tracking-wider">Đặt lại</button>
        </div>
        
        <div className="flex flex-col gap-3">
          <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Sắp xếp</label>
          <select
            className="w-full bg-surface-container-high border-white/10 rounded-lg text-on-surface font-body-md text-body-md focus:ring-primary focus:border-primary p-2"
            value={`${filters.sort_field}:${filters.sort_type}`}
            onChange={(event) => {
              const [sortField, sortType] = event.target.value.split(':');
              onChange((current) => ({ ...current, sort_field: sortField, sort_type: sortType }));
            }}
          >
            <option value="modified.time:desc">Mới cập nhật</option>
            <option value="year:desc">Năm mới nhất</option>
            <option value="year:asc">Năm cũ nhất</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-3">
          <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Thể loại</label>
          <select
            className="w-full bg-surface-container-high border-white/10 rounded-lg text-on-surface font-body-md text-body-md focus:ring-primary focus:border-primary p-2"
            value={filters.category}
            onChange={(event) => update('category', event.target.value)}
          >
            <option value="">Tất cả</option>
            {genres.map((genre) => (
              <option key={genre.slug} value={genre.slug}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Quốc gia</label>
          <select
            className="w-full bg-surface-container-high border-white/10 rounded-lg text-on-surface font-body-md text-body-md focus:ring-primary focus:border-primary p-2"
            value={filters.country}
            onChange={(event) => update('country', event.target.value)}
          >
            <option value="">Tất cả</option>
            {countries.map((country) => (
              <option key={country.slug} value={country.slug}>{country.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-3">
          <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Năm phát hành</label>
          <select
            className="w-full bg-surface-container-high border-white/10 rounded-lg text-on-surface font-body-md text-body-md focus:ring-primary focus:border-primary p-2"
            value={filters.year}
            onChange={(event) => update('year', event.target.value)}
          >
            <option value="">Tất cả</option>
            {years.slice(0, 80).map((yearItem) => (
              <option key={yearItem.year} value={yearItem.year}>{yearItem.year}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};
