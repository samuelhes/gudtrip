import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const PRESET_CITIES = [
    'Santiago',
    'Maitencillo',
    'Viña del Mar',
    'Con Con',
    'Chicureo',
];

interface CitySelectorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label: string;
}

export const CitySelector = ({ value, onChange, placeholder, label }: CitySelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredCities, setFilteredCities] = useState(PRESET_CITIES);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        // Filter cities based on input
        const filtered = PRESET_CITIES.filter(city =>
            city.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredCities(filtered);
        setIsOpen(true);
    };

    const handleSelectCity = (city: string) => {
        onChange(city);
        setIsOpen(false);
        setFilteredCities(PRESET_CITIES);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 text-left">
                {label}
            </label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-200"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {isOpen && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                        <button
                            key={city}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSelectCity(city)}
                        >
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-900 font-medium">{city}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
