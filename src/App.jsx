import React, { useState, useEffect, useMemo } from 'react';
import { 
    AlertTriangle, ArrowRight, History, PieChart as ChartIcon, X, 
    CheckCircle2, Brain, ChevronRight, Clock, Trash2, Info, Zap,
    MessageSquare, Ghost, DoorOpen, Mic, ShieldAlert, Lightbulb,
    Target, Activity, Wind, Heart, Sparkles, Stars, Timer, Flame, Compass
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis 
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const PSYCH_INSIGHTS = {
    "Anticipando algo que no pasó": "Esto es 'Ansiedad Anticipatoria'. Tu mente intenta controlar el futuro mediante el miedo para que 'nada te tome por sorpresa'. Es una ilusión de seguridad que consume tu energía vital del presente.",
    "Repasando algo que ya pasó": "Se conoce como 'Rumiación'. Tu cerebro intenta 'editar' una película que ya se estrenó. La culpa es el pegamento de este loop; soltar significa aceptar que no podés controlar el pasado.",
    "Dudando de una decisión": "Es 'Parálisis por Análisis'. El miedo a la pérdida es mayor que el deseo de ganar. Recordá: no decidir también es una decisión, y suele ser la que más angustia genera.",
    "Imaginando un problema": "Estás en una 'Simulación Catastrófica'. Tu cuerpo está respondiendo con cortisol real a una amenaza ficticia. Tu sistema nervioso no sabe que es un ensayo mental, por eso te duele.",
    "Enviar mensaje": "Buscás una 'Descarga de Tensión'. Al enviar el mensaje, creés que la ansiedad pasará a la otra persona. En realidad, solo creás una nueva espera (el 'visto') que alimentará el loop.",
    "Decir todo": "Es un 'Desborde Reactivo'. Tu neocórtex se apagó y tu cerebro reptiliano tomó el control. Gritar es un alivio físico momentáneo seguido de un costo relacional y emocional alto.",
    "Irme / Esconderme": "Respuesta de Evitación. Al huir, le confirmás a tu cerebro que la situación es 'peligrosa', reforzando el miedo para la próxima vez que ocurra algo similar.",
    "Default": "Todo pensamiento repetitivo es un hábito neuronal. Interrumpirlo es un acto de voluntad que requiere práctica constante."
};

const LOOP_CONCLUSIONS = [
    { title: "La Apertura", text: "Frenar no es solo detenerse, es elegirse. Al hacerte consciente de lo que pasa en tu mente, has dejado de ser un pasajero para convertirte en el guía.", sub: "Al observar tu mente sin juzgarla, has plantado la semilla de una vida más libre y liviana." },
    { title: "Soberanía Ganada", text: "Has transformado el ruido en silencio consciente. Este es el primer paso hacia una versión de vos que ya no se sabotea por hábito.", sub: "Tu conciencia se expande cada vez que decidís no creerle ciegamente a tus miedos." },
    { title: "Paz en la Conciencia", text: "Al observar tu mente, dejaste de ser el pensamiento para ser quien lo observa. En esa distancia sagrada reside tu verdadera libertad.", sub: "Lo que viene ahora nace de un lugar de presencia, no de reacción. Confía en tu nueva claridad." }
];

const IMPULSE_CONCLUSIONS = [
    { title: "Dominio Biológico", text: "La descarga química ya salió de tu torrente sanguíneo. Has vencido a la biología pura al no alimentar el fuego con más pensamientos.", sub: "Hoy te has dado el regalo de no arrepentirte mañana. Eso es amor propio en acción." },
    { title: "Soberanía Emocional", text: "Permitiste que la ola pasara sin ahogarte en ella. Ahora que la química bajó, tu claridad es tu mejor aliada.", sub: "Elegiste la conciencia sobre la reacción visceral. Estás elevando tu nivel de respuesta ante la vida." },
    { title: "El Poder del Silencio", text: "El impulso era una llama. Al no darle 'leña' con rumiación, la llama se apagó sola. Disfruta de la calma que acabas de proteger.", sub: "Tu fuerza no está en gritar, sino en la capacidad de contenerte hasta que el guía interno regrese." }
];

const COGNITIVE_DISTORTIONS = [
    { id: "Catastrofismo", label: "Catastrofismo", desc: "Pensar que lo peor va a pasar sí o sí." },
    { id: "Lectura de Mente", label: "Lectura de Mente", desc: "Creer que sabés lo que los demás piensan de vos." },
    { id: "Todo o Nada", label: "Todo o Nada", desc: "Si no es perfecto, es un fracaso total." },
    { id: "Personalización", label: "Personalización", desc: "Creer que todo lo malo es por tu culpa." },
    { id: "Filtro Negativo", label: "Filtro Negativo", desc: "Solo ves lo malo e ignorás lo bueno." }
];

const EMOTIONS = ["Ansiedad", "Miedo", "Ira", "Culpa", "Tristeza", "Frustración"];

const Header = ({ title, onBack }) => (
    <div className="flex items-center gap-4 mb-8">
        {onBack && <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-5 h-5 text-slate-400" /></button>}
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
    </div>
);

const NavBar = ({ view, setView }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-2xl z-50">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
            {[
                { id: 'home', icon: Brain, label: 'Inicio' },
                { id: 'history', icon: History, label: 'Bitácora' },
                { id: 'patterns', icon: ChartIcon, label: 'Patrones' }
            ].map(item => (
                <button key={item.id} onClick={() => setView(item.id)}
                    className={cn("flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all",
                        view === item.id ? "text-rose-800 bg-rose-50" : "text-slate-400 hover:text-slate-600")}>
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
            ))}
        </div>
    </div>
);

export default function App() {
    const [view, setView] = useState('home');
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [randomIdx, setRandomIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);

    useEffect(() => {
        const saved = localStorage.getItem('cortando_el_loop_data');
        if (saved) { try { setEntries(JSON.parse(saved)); } catch (e) { console.error(e); } }
    }, []);

    useEffect(() => {
        localStorage.setItem('cortando_el_loop_data', JSON.stringify(entries));
    }, [entries]);

    useEffect(() => {
        let timer;
        if (view === 'impulse_step_2' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [view, timeLeft]);

    const startLoop = () => {
        setCurrentEntry({ id: Date.now(), type: 'loop', loop_type: null, emotion: null, distortion: null, optional_text: '', timestamp: Date.now() });
        setRandomIdx(Math.floor(Math.random() * LOOP_CONCLUSIONS.length));
        setView('loop_step_1');
    };

    const startImpulse = () => {
        setCurrentEntry({ id: Date.now(), type: 'impulse', impulse_type: null, optional_text: '', timestamp: Date.now() });
        setRandomIdx(Math.floor(Math.random() * IMPULSE_CONCLUSIONS.length));
        setTimeLeft(90);
        setView('impulse_step_1');
    };

    const saveEntry = () => {
        if (currentEntry) {
            setEntries(prev => [{ ...currentEntry, timestamp: Date.now() }, ...prev]);
        }
        setCurrentEntry(null);
        setView('home');
    };

    const deleteEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));

    const stats = useMemo(() => {
        if (entries.length === 0) return null;
        const typeCounts = {};
        entries.forEach(e => {
            const key = e.loop_type || e.impulse_type || 'Sin tipo';
            typeCounts[key] = (typeCounts[key] || 0) + 1;
        });
        const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
        return {
            mostCommonType,
            loopCount: entries.filter(e => e.type === 'loop').length,
            impulseCount: entries.filter(e => e.type === 'impulse').length,
            typeData: Object.entries(typeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5)
        };
    }, [entries]);

    if (view === 'home') {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 min-h-screen bg-white animate-fade-in">
                <div className="pt-8 pb-10 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cortando el Loop</p>
                    <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tight">Bitácora <span className="text-rose-800">Mental</span>.</h1>
                    <p className="text-slate-500 font-medium text-base leading-relaxed pt-1">Interrumpí el loop. Gestioná el impulso. Recuperá tu centro.</p>
                </div>
                <div className="space-y-4">
                    <button onClick={startLoop} className="w-full p-8 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-between group shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white/10 rounded-2xl group-hover:rotate-6 transition-transform"><Brain className="w-8 h-8" /></div>
                            <div className="text-left">
                                <div className="font-black text-xl tracking-tight">Cortá el Loop</div>
                                <div className="text-slate-400 text-sm font-medium">Pensamiento repetitivo</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-400" />
                    </button>
                    <button onClick={startImpulse} className="w-full p-8 bg-rose-800 text-white rounded-[2.5rem] flex items-center justify-between group shadow-2xl shadow-rose-900/20 hover:bg-rose-900 transition-all active:scale-95">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white/10 rounded-2xl group-hover:rotate-6 transition-transform"><Zap className="w-8 h-8" /></div>
                            <div className="text-left">
                                <div className="font-black text-xl tracking-tight">Frená el Impulso</div>
                                <div className="text-rose-300 text-sm font-medium">Antes de reaccionar</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-rose-300" />
                    </button>
                </div>
                {entries.length > 0 && (
                    <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros</div>
                                <div className="font-black text-rose-800">{entries.length} entradas guardadas</div>
                            </div>
                        </div>
                        <button onClick={() => setView('history')} className="text-rose-800 font-bold text-sm underline">Ver todo</button>
                    </div>
                )}
                <NavBar view={view} setView={setView} />
            </div>
        );
    }

    if (view.startsWith('loop_')) {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 min-h-screen bg-white">
                <Header title="Cortando el Loop" onBack={() => setView('home')} />
                <div className="space-y-6">
                    {view === 'loop_step_1' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 space-y-4">
                                <div className="flex items-center gap-3 text-rose-800 font-black text-xs uppercase tracking-widest"><AlertTriangle className="w-5 h-5" /> Paso 1: Nombrá el Loop</div>
                                <p className="text-slate-600 font-medium leading-relaxed">¿En qué está atrapada tu mente ahora mismo?</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {["Anticipando algo que no pasó", "Repasando algo que ya pasó", "Dudando de una decisión", "Imaginando un problema"].map(opt => (
                                    <button key={opt} onClick={() => { setCurrentEntry(p => ({...p, loop_type: opt})); setView('loop_step_2'); }}
                                        className="p-6 bg-white border-2 border-slate-100 rounded-3xl text-left font-bold text-slate-700 hover:border-rose-800 hover:text-rose-800 transition-all shadow-sm hover:shadow-md">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {view === 'loop_step_2' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-8 bg-rose-50 rounded-[2.5rem] border-2 border-rose-100 space-y-3">
                                <div className="flex items-center gap-3 text-rose-800 font-black text-xs uppercase tracking-widest"><Brain className="w-5 h-5" /> Lo que está pasando</div>
                                <p className="text-slate-700 font-medium leading-relaxed italic text-sm">{PSYCH_INSIGHTS[currentEntry?.loop_type] || PSYCH_INSIGHTS.Default}</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">¿Qué emoción sentís?</p>
                                <div className="flex flex-wrap gap-2">
                                    {EMOTIONS.map(em => (
                                        <button key={em} onClick={() => setCurrentEntry(p => ({...p, emotion: em}))}
                                            className={cn("px-4 py-2 rounded-2xl text-sm font-black border-2 transition-all",
                                                currentEntry?.emotion === em ? "bg-rose-800 text-white border-rose-800" : "bg-white text-slate-600 border-slate-200 hover:border-rose-800")}>
                                            {em}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setView('loop_step_3')} disabled={!currentEntry?.emotion}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30">
                                CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                            </button>
                        </div>
                    )}
                    {view === 'loop_step_3' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">¿Reconocés algún patrón?</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {COGNITIVE_DISTORTIONS.map(d => (
                                        <button key={d.id} onClick={() => setCurrentEntry(p => ({...p, distortion: d.id}))}
                                            className={cn("p-5 rounded-3xl text-left border-2 transition-all",
                                                currentEntry?.distortion === d.id ? "bg-rose-800 text-white border-rose-800" : "bg-white border-slate-100 hover:border-rose-800 shadow-sm")}>
                                            <div className={cn("font-black text-sm", currentEntry?.distortion === d.id ? "text-white" : "text-slate-900")}>{d.label}</div>
                                            <div className={cn("text-xs font-medium mt-1", currentEntry?.distortion === d.id ? "text-rose-200" : "text-slate-400")}>{d.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setView('loop_step_4')} disabled={!currentEntry?.distortion}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30">
                                CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                            </button>
                        </div>
                    )}
                    {view === 'loop_step_4' && (
                        <div className="flex flex-col min-h-[500px] space-y-6 animate-fade-in">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descarga opcional</p>
                                <p className="text-sm text-slate-500 font-medium">Escribí lo que necesitás soltar. Nadie lo va a leer.</p>
                            </div>
                            <textarea
                                className="w-full flex-1 min-h-[200px] p-6 bg-slate-900 text-rose-300 font-mono border-none rounded-[2rem] focus:ring-4 focus:ring-rose-100 outline-none resize-none text-base shadow-2xl"
                                placeholder="Escribí acá todo lo que tu mente quiere gritar..."
                                value={currentEntry?.optional_text || ''}
                                onChange={(e) => setCurrentEntry(p => ({...p, optional_text: e.target.value}))}
                            />
                            <button onClick={() => setView('loop_step_5')}
                                className="w-full py-5 bg-rose-800 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
                                CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                            </button>
                        </div>
                    )}
                    {view === 'loop_step_5' && (
                        <div className="flex flex-col justify-center min-h-[500px] text-center space-y-10 animate-fade-in">
                            <div className="space-y-6">
                                <div className="inline-flex p-6 bg-rose-50 text-rose-800 rounded-full relative">
                                    <Sparkles className="w-12 h-12 relative z-10" />
                                    <div className="w-16 h-16 bg-rose-400/20 absolute rounded-full animate-ping"></div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">{LOOP_CONCLUSIONS[randomIdx].title}</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed px-4 font-medium italic">{LOOP_CONCLUSIONS[randomIdx].text}</p>
                                    <div className="p-6 bg-rose-50 rounded-[2rem] border-2 border-rose-100 text-rose-900 font-bold text-sm leading-relaxed shadow-sm">{LOOP_CONCLUSIONS[randomIdx].sub}</div>
                                </div>
                            </div>
                            <button onClick={saveEntry} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all hover:bg-slate-800">
                                FINALIZAR Y CERRAR
                            </button>
                        </div>
                    )}
                </div>
                <NavBar view={view} setView={setView} />
            </div>
        );
    }

    if (view.startsWith('impulse_')) {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 min-h-screen bg-white">
                <Header title="Frená el Impulso" onBack={() => setView('home')} />
                <div className="space-y-6">
                    {view === 'impulse_step_1' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-8 bg-pink-50 rounded-[2.5rem] border-2 border-pink-100 space-y-4">
                                <div className="flex items-center gap-3 text-pink-700 font-black text-xs uppercase tracking-widest"><Zap className="w-5 h-5" /> Paso 1: ¿Qué querés hacer?</div>
                                <p className="text-slate-600 font-medium leading-relaxed">Nombrá el impulso antes de que te maneje.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {["Enviar mensaje", "Decir todo", "Irme / Esconderme"].map(opt => (
                                    <button key={opt} onClick={() => { setCurrentEntry(p => ({...p, impulse_type: opt})); setView('impulse_step_2'); }}
                                        className="p-6 bg-white border-2 border-slate-100 rounded-3xl text-left font-bold text-slate-700 hover:border-pink-500 hover:text-pink-700 transition-all shadow-sm hover:shadow-md">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {view === 'impulse_step_2' && (
                        <div className="space-y-8 animate-fade-in text-center">
                            <div className="space-y-4">
                                <div className="relative inline-flex items-center justify-center w-40 h-40 mx-auto">
                                    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="#fce7f3" strokeWidth="12" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="#be185d" strokeWidth="12" strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - timeLeft / 90)}`}
                                            style={{ transition: 'stroke-dashoffset 1s linear' }} />
                                    </svg>
                                    <div className="absolute text-center">
                                        <div className="text-5xl font-black text-slate-900">{timeLeft}</div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">seg</div>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">No hagas nada todavía.</h2>
                                <p className="text-slate-500 font-medium leading-relaxed px-4">La descarga química dura 90 segundos. <br/>Solo respirá y esperá.</p>
                            </div>
                            <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 text-left">
                                <p className="text-sm text-pink-900 font-medium italic leading-relaxed">{PSYCH_INSIGHTS[currentEntry?.impulse_type] || PSYCH_INSIGHTS.Default}</p>
                            </div>
                            {timeLeft === 0 && (
                                <button onClick={() => setView('impulse_step_3')}
                                    className="w-full py-5 bg-rose-800 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all animate-fade-in">
                                    YA PASÓ · CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                                </button>
                            )}
                        </div>
                    )}
                    {view === 'impulse_step_3' && (
                        <div className="flex flex-col min-h-[500px] space-y-6 animate-fade-in">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descarga segura</p>
                                <p className="text-sm text-slate-500 font-medium">Escribí TODO lo que querías decir o hacer. Acá es seguro.</p>
                            </div>
                            <textarea
                                className="w-full flex-1 min-h-[200px] p-6 bg-slate-900 text-pink-400 font-mono border-none rounded-[2rem] focus:ring-4 focus:ring-pink-100 outline-none resize-none text-base shadow-2xl"
                                placeholder="DESCÁRGATE TOTALMENTE ACÁ... NO ALIMENTES MÁS EL FUEGO."
                                value={currentEntry?.optional_text || ''}
                                onChange={(e) => setCurrentEntry(p => ({...p, optional_text: e.target.value}))}
                            />
                            <button onClick={() => setView('impulse_step_4')}
                                className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
                                CONTINUAR <ArrowRight className="w-5 h-5 ml-2 inline" />
                            </button>
                        </div>
                    )}
                    {view === 'impulse_step_4' && (
                        <div className="flex flex-col justify-center min-h-[500px] text-center space-y-10 animate-fade-in">
                            <div className="space-y-6">
                                <div className="inline-flex p-6 bg-pink-50 text-pink-600 rounded-full relative">
                                    <Stars className="w-12 h-12 relative z-10" />
                                    <div className="w-16 h-16 bg-pink-400/20 absolute rounded-full animate-ping"></div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">{IMPULSE_CONCLUSIONS[randomIdx].title}</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed px-4 font-medium italic">{IMPULSE_CONCLUSIONS[randomIdx].text}</p>
                                    <div className="p-6 bg-pink-50 rounded-[2rem] border-2 border-pink-100 text-pink-900 font-bold text-sm leading-relaxed shadow-sm">{IMPULSE_CONCLUSIONS[randomIdx].sub}</div>
                                </div>
                            </div>
                            <button onClick={saveEntry} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all hover:bg-slate-800">
                                FINALIZAR Y CERRAR
                            </button>
                        </div>
                    )}
                </div>
                <NavBar view={view} setView={setView} />
            </div>
        );
    }

    if (view === 'history') {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 bg-slate-50 min-h-screen animate-fade-in">
                <Header title="Bitácora Mental" />
                <div className="space-y-4">
                    {entries.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No hay registros aún.</div>
                    ) : (
                        entries.map(e => (
                            <div key={e.id} className="p-6 bg-white rounded-[2.2rem] border border-slate-100 shadow-sm space-y-3 relative group transition-all hover:shadow-md animate-fade-in">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", e.type === 'impulse' ? "bg-pink-100 text-pink-700" : "bg-rose-100 text-rose-800")}>
                                            {e.type === 'impulse' ? "Impulso" : "Loop"}
                                        </span>
                                        {e.emotion && <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">{e.emotion}</span>}
                                        {e.distortion && <span className="bg-slate-50 text-rose-800/80 px-2 py-0.5 rounded text-[10px] font-black uppercase">{e.distortion}</span>}
                                    </div>
                                    <button onClick={() => deleteEntry(e.id)} className="p-1 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <p className="font-black text-slate-900 text-sm leading-tight">{e.loop_type || e.impulse_type}</p>
                                <p className="text-slate-600 text-xs italic bg-slate-50 p-4 rounded-2xl border-l-4 border-slate-200 font-medium leading-relaxed">"{e.optional_text || 'Procesado con éxito.'}"</p>
                                <div className="text-[9px] text-slate-300 font-black tracking-widest uppercase">{new Date(e.timestamp).toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
                <NavBar view={view} setView={setView} />
            </div>
        );
    }

    if (view === 'patterns') {
        return (
            <div className="max-w-md mx-auto p-6 pb-24 bg-slate-50 min-h-screen space-y-6 animate-fade-in">
                <Header title="Análisis Profundo" />
                {!stats ? (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">Bitácora vacía. Seguí registrando para mapear tus patrones.</div>
                ) : (
                    <>
                        <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-5 shadow-2xl relative overflow-hidden border border-slate-800">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-3 text-pink-400"><ShieldAlert className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Soberanía Mental</span></div>
                            <div className="space-y-1">
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Patrón dominante:</p>
                                <h3 className="text-2xl font-black text-white leading-tight">{stats.mostCommonType}</h3>
                            </div>
                            <div className="p-5 bg-white/5 rounded-3xl text-sm text-slate-300 italic leading-relaxed border border-white/10 font-medium">{PSYCH_INSIGHTS[stats.mostCommonType] || PSYCH_INSIGHTS.Default}</div>
                        </div>
                        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-widest text-center">Tus Desafíos Principales</h4>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.typeData} layout="vertical" margin={{ left: -10, right: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={140} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="value" fill="#9f1239" radius={[0, 10, 10, 0]} barSize={28}>
                                            {stats.typeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name.includes("mensaje") || entry.name.includes("Gritar") ? '#ec4899' : '#9f1239'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-7 bg-rose-50 rounded-[2.2rem] text-center border-2 border-rose-100 shadow-sm">
                                <p className="text-4xl font-black text-rose-800 leading-none">{stats.loopCount}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Loops</p>
                            </div>
                            <div className="p-7 bg-pink-50 rounded-[2.2rem] text-center border-2 border-pink-100 shadow-sm">
                                <p className="text-4xl font-black text-pink-600 leading-none">{stats.impulseCount}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Impulsos</p>
                            </div>
                        </div>
                    </>
                )}
                <NavBar view={view} setView={setView} />
            </div>
        );
    }

    return null;
}
