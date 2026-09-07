import { Building, Lock } from 'lucide-react';
import FormField from './FormField';
import CustomSelect from './CustomSelect';
import type { Site } from '../../types';
import type { BaseFieldProps } from './types';

interface SiteSelectorProps extends BaseFieldProps {
    sites: Site[];
    loadingSites: boolean;
    isSiteLocked: boolean;
}

export default function SiteSelector({ form, onChange, errors, sites, loadingSites, isSiteLocked }: SiteSelectorProps) {

    const siteOptions = sites.map(site => ({
        label: site.site_name,
        value: site._id
    }));

    return (
        <FormField 
            label="Site" 
            error={errors.site_id} 
            icon={isSiteLocked ? <Lock size={18} className="text-slate-400" /> : <Building size={18} />}
        >
            <CustomSelect
                name="site_id"
                value={form.site_id}
                onChange={onChange}
                options={siteOptions}
                placeholder="Select site"
                disabled={loadingSites || isSiteLocked}
                error={!!errors.site_id}
                icon={isSiteLocked ? <Lock size={18} className="text-slate-400" /> : <Building size={18} />}
            />
        </FormField>
    );
}
