import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      {/* Logo and brand/title block */}
      <div className="flex items-center gap-3">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={36}
          height={36}
          priority
          className="h-8 w-8 object-contain"
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white tracking-wide">
            SecureSight
          </span>
          <span className="text-xs text-gray-400 mt-1 font-normal">
            CCTV Monitoring System
          </span>
        </div>
      </div>
      {/* Dummy user profile */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-white font-medium text-sm">Jane Doe</span>
          <span className="text-gray-400 text-xs">jane.doe@email.com</span>
        </div>
        <span className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-700 border-2 border-gray-900 shadow ring-1 ring-blue-400/60">
          <span className="text-lg text-white font-bold">JD</span>
        </span>
      </div>
    </nav>
  );
}
