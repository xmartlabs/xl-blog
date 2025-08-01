import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const normalizeKey = (label) =>
  label.trim().replace(/\s+/g, '').toLowerCase();

const Table = ({
  title,
  headers = '',
  rows = '',
}) => {
  const parsedHeaders = useMemo(() => {
    return headers
      .split(',')
      .map((header) => header.trim())
      .filter((header) => header)
      .map((label) => ({
        label,
        key: normalizeKey(label),
      }));
  }, [headers]);

  const bodyRows = useMemo(() => {
    return rows
      .split('~')
      .map((rowStr) =>
        rowStr
          .split(',')
          .map((cell) => cell.trim())
      )
      .map((cells) => {
        const obj = {};
        parsedHeaders.forEach((header, idx) => {
          obj[header.key] = cells[idx];
        });
        return obj;
      });
  }, [rows, parsedHeaders]);

  const renderCell = (row, header) => {
    let cell = row[header.key];
    return cell ?? "-";
  };

  return (
    <div
      className="w-full overflow-hidden"
    >
      {title && (
        <div className="border-b border-slateBorder bg-white ">
          <h2 className="text-lg font-semibold text-softNavy mt-0">{title}</h2>
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed">
          <thead>
            <tr className="bg-white">
              {parsedHeaders.map((h) => (
                <th
                  key={h.key}
                  className="py-3 px-6 text-[0.65rem] font-semibold tracking-wider uppercase text-left"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((r, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-dark2"}
              >
                {parsedHeaders.map((h) => (
                  <td
                    key={h.key}
                    className="py-4 px-2 align-top text-sm text-softNavy text-left"
                  >
                    {renderCell(r, h)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  title: PropTypes.string,
  headers: PropTypes.string.isRequired,
  rows: PropTypes.string.isRequired,
};

export { Table };
