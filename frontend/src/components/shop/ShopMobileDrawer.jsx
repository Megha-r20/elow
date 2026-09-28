import { X } from "lucide-react";
import { ShopFilters } from "./ShopFilters";

export function ShopMobileDrawer({
    isOpen,
    onClose,
    filteredCount,
    filterProps,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
                <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3D9]">
                        <h3 className="font-bold text-sm text-[#23201D] tracking-wide uppercase">
                            Filter Products
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-[#F4EFE6] text-[#23201D] cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <ShopFilters {...filterProps} />
                </div>

                <div className="pt-6 border-t border-[#EAE3D9] mt-6">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-[#23201D] text-white text-xs font-semibold hover:bg-[#35312D] transition-colors cursor-pointer"
                    >
                        View {filteredCount} Products
                    </button>
                </div>
            </div>
        </div>
    );
}
