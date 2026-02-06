'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, CheckCircle, AlertCircle, HelpCircle, Smartphone, Printer, Scan } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type DeviceStatus = 'supported' | 'testing' | 'unsupported'

interface Device {
    name: string
    category: 'mobile' | 'printer' | 'scanner' | 'terminal'
    status: DeviceStatus
    notes?: string
}

const mockDevices: Device[] = [
    { name: 'Samsung Galaxy A series', category: 'mobile', status: 'supported', notes: 'Android 10+' },
    { name: 'Samsung Galaxy Tab A8', category: 'mobile', status: 'supported', notes: 'Great for Counter Display' },
    { name: 'Epson TM-T20III', category: 'printer', status: 'supported', notes: 'USB & Ethernet' },
    { name: 'XPrinter XP-58', category: 'printer', status: 'supported', notes: 'Best budget option' },
    { name: 'Sunmi V2', category: 'terminal', status: 'supported', notes: 'All-in-one handheld' },
    { name: 'Sunmi T2', category: 'terminal', status: 'supported', notes: 'Desktop terminal' },
    { name: 'Generic Bluetooth Scanner', category: 'scanner', status: 'supported', notes: 'HID Mode' },
    { name: 'iPhone 6', category: 'mobile', status: 'unsupported', notes: 'iOS version too old' },
    { name: 'Huawei P40 Lite', category: 'mobile', status: 'supported', notes: 'via AppGallery' },
]

export default function DeviceChecker() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState<'all' | 'mobile' | 'printer' | 'scanner'>('all')

    const filteredDevices = mockDevices.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(query.toLowerCase())
        const matchesCategory = category === 'all' || d.category === category || (category === 'mobile' && d.category === 'terminal')
        return matchesSearch && matchesCategory
    })

    // Group by category icons
    const getIcon = (cat: string) => {
        switch (cat) {
            case 'mobile': return <Smartphone className="w-5 h-5" />
            case 'terminal': return <Smartphone className="w-5 h-5" />
            case 'printer': return <Printer className="w-5 h-5" />
            case 'scanner': return <Scan className="w-5 h-5" />
            default: return <HelpCircle className="w-5 h-5" />
        }
    }

    const getStatusColor = (status: DeviceStatus) => {
        switch (status) {
            case 'supported': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'unsupported': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search your device model (e.g. Samsung A12, Sunmi)..."
                        className="pl-10 h-12 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant={category === 'all' ? 'appex' : 'outline'}
                        onClick={() => setCategory('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={category === 'mobile' ? 'appex' : 'outline'}
                        onClick={() => setCategory('mobile')}
                    >
                        Phones & Tablets
                    </Button>
                    <Button
                        variant={category === 'printer' ? 'appex' : 'outline'}
                        onClick={() => setCategory('printer')}
                    >
                        Printers
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredDevices.length > 0 ? (
                    filteredDevices.map((device, idx) => (
                        <Card key={idx} className="border hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        {getIcon(device.category)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{device.name}</h4>
                                        <p className="text-sm text-gray-500">{device.notes}</p>
                                    </div>
                                </div>
                                <Badge className={`${getStatusColor(device.status)} border-0`}>
                                    {device.status === 'supported' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {device.status === 'unsupported' && <AlertCircle className="w-3 h-3 mr-1" />}
                                    {device.status.toUpperCase()}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Device Not Found?</h3>
                        <p className="text-gray-500 mb-6">It might still work! Appex runs on almost any Android device.</p>
                        <Button variant="outline">Contact Support to Check</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
