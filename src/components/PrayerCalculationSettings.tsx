import React, { useState } from "react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CALCULATION_METHODS, getCalculationMethodInfo } from "../utils/prayerTimes";

const PrayerCalculationSettings = () => {
  const { settings, updateLocationSettings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();

  // Local state for adjustments
  const [adjustments, setAdjustments] = useState({
    fajr: settings.location.adjustments.fajr,
    sunrise: settings.location.adjustments.sunrise,
    dhuhr: settings.location.adjustments.dhuhr,
    asr: settings.location.adjustments.asr,
    maghrib: settings.location.adjustments.maghrib,
    isha: settings.location.adjustments.isha,
  });

  // Get calculation method info
  const methodInfo = getCalculationMethodInfo(settings.location.method, settings.language);

  // Handle method change
  const handleMethodChange = (value: string) => {
    updateLocationSettings({ method: value });
    toast({
      title: t('calculationMethodUpdated'),
      description: t('prayerTimesRecalculated'),
    });
  };

  // Handle madhab change
  const handleMadhabChange = (value: 'Shafi' | 'Hanafi') => {
    updateLocationSettings({ madhab: value });
    toast({
      title: t('madhabUpdated'),
      description: t('asrTimeRecalculated'),
    });
  };

  // Handle high latitude rule change
  const handleHighLatitudeRuleChange = (value: string) => {
    updateLocationSettings({ highLatitudeRule: value });
    toast({
      title: t('highLatitudeRuleUpdated'),
      description: t('prayerTimesRecalculated'),
    });
  };

  // Handle adjustment change
  const handleAdjustmentChange = (prayer: keyof typeof adjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [prayer]: value }));
  };

  // Save all adjustments
  const saveAdjustments = () => {
    updateLocationSettings({ adjustments });
    toast({
      title: t('adjustmentsSaved'),
      description: t('prayerTimesRecalculated'),
    });
  };

  // Reset all adjustments
  const resetAdjustments = () => {
    const resetValues = {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    };
    setAdjustments(resetValues);
    updateLocationSettings({ adjustments: resetValues });
    toast({
      title: t('adjustmentsReset'),
      description: t('prayerTimesRecalculated'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Location Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {settings.language === 'ar' ? 'معلومات الموقع الحالي' : 'Current Location Info'}
          </CardTitle>
          <CardDescription>
            {settings.language === 'ar'
              ? 'معلومات الموقع المستخدم في حساب مواقيت الصلاة'
              : 'Location information used for prayer time calculations'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{settings.language === 'ar' ? 'المدينة:' : 'City:'}</span>
              <p className="text-muted-foreground">{settings.location.city}</p>
            </div>
            <div>
              <span className="font-medium">{settings.language === 'ar' ? 'الدولة:' : 'Country:'}</span>
              <p className="text-muted-foreground">{settings.location.country}</p>
            </div>
            <div>
              <span className="font-medium">{settings.language === 'ar' ? 'خط العرض:' : 'Latitude:'}</span>
              <p className="text-muted-foreground">{settings.location.latitude.toFixed(4)}°</p>
            </div>
            <div>
              <span className="font-medium">{settings.language === 'ar' ? 'خط الطول:' : 'Longitude:'}</span>
              <p className="text-muted-foreground">{settings.location.longitude.toFixed(4)}°</p>
            </div>
            {settings.location.elevation > 0 && (
              <div>
                <span className="font-medium">{settings.language === 'ar' ? 'الارتفاع:' : 'Elevation:'}</span>
                <p className="text-muted-foreground">{settings.location.elevation}m</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {settings.language === 'ar' ? 'طريقة الحساب' : 'Calculation Method'}
          </CardTitle>
          <CardDescription>
            {settings.language === 'ar'
              ? 'اختر طريقة الحساب الأنسب لمنطقتك'
              : 'Choose the calculation method most suitable for your region'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>
                {settings.language === 'ar' ? 'الطريقة المستخدمة' : 'Current Method'}
              </Label>
              <Select
                value={settings.location.method}
                onValueChange={handleMethodChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={settings.language === 'ar' ? 'اختر طريقة الحساب' : 'Select calculation method'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CALCULATION_METHODS).map((methodName) => (
                    <SelectItem key={methodName} value={methodName}>
                      {methodName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">
                {settings.language === 'ar' ? 'تفاصيل الطريقة' : 'Method Details'}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>{settings.language === 'ar' ? 'زاوية الفجر:' : 'Fajr Angle:'}</div>
                <div>{methodInfo.fajrAngle}</div>
                <div>{settings.language === 'ar' ? 'زاوية العشاء:' : 'Isha Angle:'}</div>
                <div>{methodInfo.ishaAngle}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{methodInfo.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {settings.language === 'ar' ? 'حساب وقت العصر' : 'Asr Calculation'}
          </CardTitle>
          <CardDescription>
            {settings.language === 'ar'
              ? 'اختر المذهب الفقهي المتبع في حساب وقت العصر'
              : 'Choose the jurisprudential school for Asr time calculation'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>
                {settings.language === 'ar' ? 'المذهب الفقهي' : 'Jurisprudential School'}
              </Label>
              <Select
                value={settings.location.madhab}
                onValueChange={(value: 'Shafi' | 'Hanafi') => handleMadhabChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={settings.language === 'ar' ? 'اختر المذهب' : 'Select madhab'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shafi">
                    {settings.language === 'ar' ? 'الشافعي' : 'Shafi'}
                  </SelectItem>
                  <SelectItem value="Hanafi">
                    {settings.language === 'ar' ? 'الحنفي' : 'Hanafi'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
              {settings.location.madhab === 'Shafi'
                ? (settings.language === 'ar'
                    ? 'المذهب الشافعي: يبدأ وقت العصر عندما يصبح ظل الشيء مثله (بالإضافة إلى ظل الزوال)'
                    : 'Shafi School: Asr begins when the shadow of an object equals its length (plus the meridian shadow)'
                  )
                : (settings.language === 'ar'
                    ? 'المذهب الحنفي: يبدأ وقت العصر عندما يصبح ظل الشيء مثليه (بالإضافة إلى ظل الزوال)'
                    : 'Hanafi School: Asr begins when the shadow of an object equals twice its length (plus the meridian shadow)'
                  )
              }
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {settings.language === 'ar' ? 'قواعد العروض العالية' : 'High Latitude Rules'}
          </CardTitle>
          <CardDescription>
            {settings.language === 'ar'
              ? 'قواعد خاصة لحساب مواقيت الصلاة في المناطق ذات العروض العالية (فوق 48 درجة)'
              : 'Special rules for calculating prayer times in high latitude regions (above 48 degrees)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>
                {settings.language === 'ar' ? 'القاعدة المستخدمة' : 'Current Rule'}
              </Label>
              <Select
                value={settings.location.highLatitudeRule}
                onValueChange={handleHighLatitudeRuleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={settings.language === 'ar' ? 'اختر القاعدة' : 'Select rule'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MiddleOfTheNight">
                    {settings.language === 'ar' ? 'منتصف الليل' : 'Middle of the Night'}
                  </SelectItem>
                  <SelectItem value="SeventhOfTheNight">
                    {settings.language === 'ar' ? 'سُبع الليل' : 'Seventh of the Night'}
                  </SelectItem>
                  <SelectItem value="TwilightAngle">
                    {settings.language === 'ar' ? 'زاوية الشفق' : 'Twilight Angle'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
              {settings.location.highLatitudeRule === 'MiddleOfTheNight' && (
                settings.language === 'ar'
                  ? 'منتصف الليل: يُحسب الفجر والعشاء بناءً على منتصف الليل (الأكثر استخداماً)'
                  : 'Middle of the Night: Fajr and Isha are calculated based on midnight (most commonly used)'
              )}
              {settings.location.highLatitudeRule === 'SeventhOfTheNight' && (
                settings.language === 'ar'
                  ? 'سُبع الليل: يُحسب الفجر والعشاء بناءً على سُبع الليل (للمناطق القطبية)'
                  : 'Seventh of the Night: Fajr and Isha are calculated based on 1/7 of the night (for polar regions)'
              )}
              {settings.location.highLatitudeRule === 'TwilightAngle' && (
                settings.language === 'ar'
                  ? 'زاوية الشفق: يُحسب الفجر والعشاء بناءً على زاوية الشفق (للمناطق الأوروبية)'
                  : 'Twilight Angle: Fajr and Isha are calculated based on twilight angle (for European regions)'
              )}
            </div>

            {Math.abs(settings.location.latitude) > 48 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  {settings.language === 'ar'
                    ? '⚠️ موقعك في منطقة عروض عالية. قد تحتاج لضبط هذه القاعدة للحصول على أوقات صحيحة.'
                    : '⚠️ Your location is in a high latitude region. You may need to adjust this rule for accurate times.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {settings.language === 'ar' ? 'التعديلات اليدوية' : 'Manual Adjustments'}
          </CardTitle>
          <CardDescription>
            {settings.language === 'ar'
              ? 'قم بتعديل أوقات الصلاة يدوياً بالدقائق حسب الحاجة (±30 دقيقة لكل وقت)'
              : 'Manually adjust prayer times in minutes as needed (±30 minutes for each prayer)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fajr">
              <AccordionTrigger>
                {t('fajr')} ({adjustments.fajr > 0 ? '+' : ''}{adjustments.fajr} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.fajr]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('fajr', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sunrise">
              <AccordionTrigger>
                {t('sunrise')} ({adjustments.sunrise > 0 ? '+' : ''}{adjustments.sunrise} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.sunrise]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('sunrise', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dhuhr">
              <AccordionTrigger>
                {t('dhuhr')} ({adjustments.dhuhr > 0 ? '+' : ''}{adjustments.dhuhr} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.dhuhr]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('dhuhr', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="asr">
              <AccordionTrigger>
                {t('asr')} ({adjustments.asr > 0 ? '+' : ''}{adjustments.asr} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.asr]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('asr', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maghrib">
              <AccordionTrigger>
                {t('maghrib')} ({adjustments.maghrib > 0 ? '+' : ''}{adjustments.maghrib} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.maghrib]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('maghrib', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="isha">
              <AccordionTrigger>
                {t('isha')} ({adjustments.isha > 0 ? '+' : ''}{adjustments.isha} {t('minutes')})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>-30</span>
                    <span>0</span>
                    <span>+30</span>
                  </div>
                  <Slider
                    value={[adjustments.isha]}
                    min={-30}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleAdjustmentChange('isha', value[0])}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetAdjustments}>
            {settings.language === 'ar' ? 'إعادة تعيين' : 'Reset Adjustments'}
          </Button>
          <Button onClick={saveAdjustments}>
            {settings.language === 'ar' ? 'حفظ التعديلات' : 'Save Adjustments'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrayerCalculationSettings;
