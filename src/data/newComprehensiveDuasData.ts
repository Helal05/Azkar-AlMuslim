export interface Dua {
  id: string; // Added id property to match data
  text: string;
  translation?: string; // Optional translation
  reference?: string; // Optional reference
}

export interface DuaCategory {
  id: string;
  title: string;
  duas: Dua[];
  backgroundColor?: string; // Optional: for specific card background if needed
  pattern?: string; // Optional: for specific pattern if needed
}

export const newComprehensiveDuas: DuaCategory[] = [
  {
    id: "introduction_to_dua",
    title: "مقدمة الدعاء",
    duas: [
      { id: "introduction_to_dua_1", text: "اللهم إني أسألك بأني لك الحمد، لا إله إلا أنت المنان بديع السموات والأرض يا ذا الجلال والإكرام يا حي يا قيوم." },
      { id: "introduction_to_dua_2", text: "اللهم إني أسألك بأني أشهد أنك أنت الله لا إله إلا أنت، الأحد الصمد، الذي لم يلد ولم يولد، ولم يكن له كفوا أحد." },
      { id: "introduction_to_dua_3", text: "اللهم ربنا لك الحمد، ملء السموات والأرض، وملء ما شئت من شيء بعد، أهل الثناء والمجد، أحق ما قال العبد، وكلنا لك عبد، اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد." },
      { id: "introduction_to_dua_4", text: "لا إله إلا أنت سبحانك إني كنت من الظالمين." },
    ],
  },
  {
    id: "asking_allah_for_jannah_and_salvation_from_hell",
    title: "سؤال الله الجنة و النجاة من النار",
    duas: [
      { id: "asking_allah_for_jannah_and_salvation_from_hell_1", text: "اللهم إني أسألك الجنة وأستجير بك من النار." },
      { id: "asking_allah_for_jannah_and_salvation_from_hell_2", text: "رب ابن لي عندك بيتا في الجنة." },
      { id: "asking_allah_for_jannah_and_salvation_from_hell_3", text: "ربنا اصرف عنا عذاب جهنم إن عذابها كان غراما." },
      { id: "asking_allah_for_jannah_and_salvation_from_hell_4", text: "اللهم إني أعوذ بك من عذاب جهنم، ومن عذاب القبر، ومن فتنة المحيا والممات، ومن شر فتنة المسيح الدجال." },
      { id: "asking_allah_for_jannah_and_salvation_from_hell_5", text: "اللهم إني أسألك موجبات رحمتك، وعزائم مغفرتك، والسلامة من كل إثم، والغنيمة من كل بر، والفوز بالجنة، والنجاة من النار." },
    ],
  },
  {
    id: "asking_allah_for_forgiveness_and_mercy",
    title: "سؤال الله المغفرة و الرحمة",
    duas: [
      { id: "asking_allah_for_forgiveness_and_mercy_1", text: "ربنا إننا آمنا فاغفر لنا ذنوبنا وقنا عذاب النار." },
      { id: "asking_allah_for_forgiveness_and_mercy_2", text: "ربنا اغفر لنا ذنوبنا وإسرافنا في أمرنا." },
      { id: "asking_allah_for_forgiveness_and_mercy_3", text: "ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين." },
      { id: "asking_allah_for_forgiveness_and_mercy_4", text: "ربنا آمنا فاغفر لنا وارحمنا وأنت خير الراحمين." },
      { id: "asking_allah_for_forgiveness_and_mercy_5", text: "رب اغفر وارحم وأنت خير الراحمين." },
      { id: "asking_allah_for_forgiveness_and_mercy_6", text: "اللهم إني أسألك يا الله بأنك الواحد الأحد، الصمد، الذي لم يلد ولم يولد، ولم يكن له كفوا أحد، أن تغفر لي ذنوبي، إنك أنت الغفور الرحيم." },
      { id: "asking_allah_for_forgiveness_and_mercy_7", text: "اللهم اغفر لي خطيئتي وجهلي، وإسرافي في أمري، وما أنت أعلم به مني، اللهم اغفر لي خطئي وعمدي، وهزلي وجدي، وكل ذلك عندي، اللهم اغفر لي ما قدمت وما أخرت، وما أسررت وما أعلنت، أنت المقدم وأنت المؤخر، وأنت على كل شيء قدير." },
      { id: "asking_allah_for_forgiveness_and_mercy_8", text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء لك بذنبي، فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت." },
      { id: "asking_allah_for_forgiveness_and_mercy_9", text: "اللهم إني ظلمت نفسي ظلما كثيرا ولا يغفر الذنوب إلا أنت فاغفر لي مغفرة من عندك وارحمني إنك أنت الغفور الرحيم." },
      { id: "asking_allah_for_forgiveness_and_mercy_10", text: "اللهم اغفر لي ذنبي كله، دقه وجله، وأوله وآخره، وعلانيته وسره." },
      { id: "asking_allah_for_forgiveness_and_mercy_11", text: "اللهم طهرني من الذنوب والخطايا، اللهم نقني منها، كما ينقى الثوب الأبيض من الدنس، اللهم طهرني بالثلج، والبرد، والماء البارد." },
      { id: "asking_allah_for_forgiveness_and_mercy_12", text: "رب اغفر لي وتب علي إنك أنت التواب الرحيم." },
      { id: "asking_allah_for_forgiveness_and_mercy_13", text: "اللهم اغفر لحينا وميتنا وشاهدنا وغائبنا، وصغيرنا وكبيرنا، وذكرنا وأنثانا، اللهم من أحييته منا فأحيه على الإسلام، ومن توفيته منا فتوفه على الإيمان اللهم لا تحرمنا أجره، ولا تضلنا بعده." },
      { id: "asking_allah_for_forgiveness_and_mercy_14", text: "اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم." },
      { id: "asking_allah_for_forgiveness_and_mercy_15", text: "اللهم اغفر لي، وارحمني، واهدني، وعافني، وارزقني." },
    ],
  },
  {
    id: "asking_allah_for_pardon_and_wellbeing",
    title: "سؤال الله العفو و العافية",
    duas: [
      { id: "asking_allah_for_pardon_and_wellbeing_1", text: "اللهم إنك عفو تحب العفو فاعف عني." },
      { id: "asking_allah_for_pardon_and_wellbeing_2", text: "اللهم إني أسألك المعافاة في الدنيا والآخرة." },
      { id: "asking_allah_for_pardon_and_wellbeing_3", text: "اللهم إني أسألك الهدى، والتقى، والعفاف، والغنى." },
      { id: "asking_allah_for_pardon_and_wellbeing_4", text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت." },
      { id: "asking_allah_for_pardon_and_wellbeing_5", text: "اللهم متعني بسمعي وبصري، واجعلهما الوارث مني، وانصرني على من ظلمني، وخذ منه بثأري." },
      { id: "asking_allah_for_pardon_and_wellbeing_6", text: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي وأهلي ومالي، اللهم استر عوراتي وآمن روعاتي، اللهم احفظني من بين يدي ومن خلفي وعن يميني وعن شمالي ومن فوقي، وأعوذ بعظمتك أن أغتال من تحتي." },
    ],
  },
  {
    id: "asking_allah_for_guidance_and_steadfastness_in_religion",
    title: "سؤال الله الهداية و الرشد و الثبات على الدين",
    duas: [
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_1", text: "اللهم إني أسألك الهدى والتقى، والعفاف والغنى." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_2", text: "اللهم اهدني، وسددني، اللهم إني أسألك الهدى والسداد." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_3", text: "اللهم اهدني فيمن هديت، وعافني فيمن عافيت، وتولني فيمن توليت، وبارك لي فيما أعطيت، وفي شر ما قضيت، إنه لا يذل من واليت، تباركت ربنا وتعاليت." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_4", text: "اللهم اجعل في قلبي نورا، وفي لساني نورا، وفي بصري نورا، وفي سمعي نورا، وعن يميني نورا، وعن يساري نورا، ومن فوقي نورا، ومن تحتي نورا، ومن أمامي نورا، ومن خلفي نورا، واجعل لي في نفسي نورا، وأعظم لي نورا." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_5", text: "ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_6", text: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_7", text: "يا مقلب القلوب ثبت قلبي على دينك." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_8", text: "اللهم مصرف القلوب صرف قلوبنا على طاعتك." },
      { id: "asking_allah_for_guidance_and_steadfastness_in_religion_9", text: "اللهم لك أسلمت، وبك آمنت، وعليك توكلت، وإليك أنبت، وبك خاصمت، اللهم إني أعوذ بعزتك، لا إله إلا أنت، أن تضلني، أنت الحي الذي لا يموت، والجن والإنس يموتون." },
    ],
  },
  {
    id: "asking_allah_for_good_in_this_world_and_hereafter",
    title: "سؤال الله خيري الدنيا والآخرة",
    duas: [
      { id: "asking_allah_for_good_in_this_world_and_hereafter_1", text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_2", text: "اللهم إني أسألك من الخير كله عاجله وآجله، ما علمت منه وما لم أعلم، وأعوذ بك من الشر كله عاجله وآجله، ما علمت منه وما لم أعلم، اللهم إني أسألك من خير ما سألك عبدك ونبيك، وأعوذ بك من شر ما عاذ به عبدك ونبيك، اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل، وأعوذ بك من النار وما قرب إليها من قول أو عمل، وأسألك أن تجعل كل قضاء قضيته لي خيرا." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_3", text: "اللهم فاطر السماوات والأرض أنت وليي في الدنيا والآخرة توفني مسلما وألحقني بالصالحين." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_4", text: "اللهم أعنا على ذكرك، وشكرك، وحسن عبادتك." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_5", text: "اللهم أحسنت خلقي فأحسن خلقي." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_6", text: "اللهم إني أسألك من فضلك ورحمتك، فإنه لا يملكها إلا أنت." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_7", text: "رب اشرح لي صدري ويسر لي أمري." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_8", text: "رب زدني علما." },
      { id: "asking_allah_for_good_in_this_world_and_hereafter_9", text: "اللهم إني أسألك حبك، وحب من يحبك، والعمل الذي يبلغني حبك." },
    ],
  },
  {
    id: "dua_for_parents_and_offspring",
    title: "الدعاء للوالدين و الأهل و الذرية",
    duas: [
      { id: "dua_for_parents_and_offspring_1", text: "رب اغفر لي ولوالدي ولمن دخل بيتي مؤمنا وللمؤمنين والمؤمنات." },
      { id: "dua_for_parents_and_offspring_2", text: "رب ارحمهما كما ربياني صغيرا." },
      { id: "dua_for_parents_and_offspring_3", text: "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماما." },
      { id: "dua_for_parents_and_offspring_4", text: "رب هب لي من لدنك ذرية طيبة إنك سميع الدعاء." },
      { id: "dua_for_parents_and_offspring_5", text: "رب اجعلني مقيم الصلاة ومن ذريتي ربنا وتقبل دعاء." },
      { id: "dua_for_parents_and_offspring_6", text: "رب أوزعني أن أشكر نعمتك التي أنعمت علي وعلى والدي وأن أعمل صالحا ترضاه وأصلح لي في ذريتي إني تبت إليك وإني من المسلمين." },
    ],
  },
  {
    id: "asking_allah_for_righteousness_in_religion_and_hereafter",
    title: "سؤال الله صلاح الدين وصلاح الآخرة",
    duas: [
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_1", text: "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي، واجعل الحياة زيادة لي في كل خير، واجعل الموت راحة لي من كل شر." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_2", text: "اللهم بعلمك الغيب وقدرتك على الخلق، أحيني ما علمت الحياة خيرا لي، وتوفني إذا علمت الوفاة خيرا لي." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_3", text: "اللهم إني أعوذ بك من ضيق الدنيا وضيق (المقام) يوم القيامة." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_4", text: "اللهم إني أعوذ بك من قلب لا يخشع، ومن دعاء لا يسمع، ومن نفس لا تشبع، ومن علم لا ينفع، أعوذ بك من هؤلاء الأربع." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_5", text: "اللهم إني أعوذ بك من شر ما عملت، ومن شر ما لم أعمل." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_6", text: "اللهم لا تخزني يوم القيامة." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_7", text: "اللهم افتح لي أبواب رحمتك." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_8", text: "اللهم اجعلني من التوابين، واجعلني من المتطهرين." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_9", text: "اللهم إني أسألك خشيتك في الغيب والشهادة، وأسألك كلمة الحق في الرضا والغضب، وأسألك القصد في الفقر والغنى، وأسألك نعيما لا ينفد، وأسألك قرة عين لا تنقطع، وأسألك الرضى بعد القضاء، وأسألك برد العيش بعد الموت، وأسألك لذة النظر إلى وجهك، والشوق إلى لقائك في غير ضراء مضرة، ولا فتنة مضلة، اللهم زينا بزينة الإيمان، واجعلنا هداة مهتدين." },
      { id: "asking_allah_for_righteousness_in_religion_and_hereafter_10", text: "اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، رب كل شيء ومليكه، أعوذ بك من شر الشيطان وشركه، وأن أقترف على نفسي سوءا، أو أجره إلى مسلم." },
    ],
  },
  {
    id: "asking_allah_for_righteousness_in_this_world_and_wellbeing",
    title: "سؤال الله صلاح الدنيا وصلاح الحال",
    duas: [
      { id: "asking_allah_for_righteousness_in_this_world_and_wellbeing_1", text: "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين." },
      { id: "asking_allah_for_righteousness_in_this_world_and_wellbeing_2", text: "اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك." },
      { id: "asking_allah_for_righteousness_in_this_world_and_wellbeing_3", text: "اللهم إني عبدك، ابن عبدك، ابن أمتك، ناصيتي بيدك، ماض في حكمك، عدل في قضاؤك، أسألك بكل اسم هو لك سميت به نفسك، أو أنزلته في كتابك، أو علمته أحدا من خلقك، أو استأثرت به في علم الغيب عندك، أن تجعل القرآن ربيع قلبي، ونور صدري، وجلاء حزني، وذهاب همي." },
    ],
  },
  {
    id: "asking_allah_for_steadfastness_in_affairs",
    title: "سؤال الله الثبات في الأمر",
    duas: [
      { id: "asking_allah_for_steadfastness_in_affairs_1", text: "اللهم إني أسألك الثبات في الأمر، والعزيمة على الرشد، وأسألك موجبات رحمتك، وعزائم مغفرتك، وأسألك شكر نعمتك، وحسن عبادتك، وأسألك قلبا سليما، ولسانا صادقا، وأسألك من خير ما تعلم، وأعوذ بك من شر ما تعلم، وأستغفرك لما تعلم، إنك أنت علام الغيوب." },
      { id: "asking_allah_for_steadfastness_in_affairs_2", text: "اللهم إني أعوذ بك من أن أضل أو أزل أو أظلم أو أظلم أو أجهل أو يجهل علي." },
    ],
  },
  {
    id: "seeking_refuge_from_physical_and_psychological_ailments",
    title: "الاستعاذة من الآفات البدنية و النفسية",
    duas: [
      { id: "seeking_refuge_from_physical_and_psychological_ailments_1", text: "اللهم إني أعوذ بك من العجز، والكسل، والجبن، والبخل، والهرم، والقسوة، والغفلة، والعيلة، والذلة، والمسكنة، وأعوذ بك من الفقر، والكفر، والشرك، والفسوق، والشقاق، والنفاق، والسمعة، والرياء، وأعوذ بك من الصمم، والبكم، والجنون، والجذام، والبرص، وسيئ الأسقام." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_2", text: "اللهم إني أعوذ بك من الجوع؛ فإنه بئس الضجيع، وأعوذ بك من الخيانة؛ فإنها بئست البطانة." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_3", text: "اللهم إني أعوذ بك من البخل، والجبن، وسوء العمر، وفتنة الصدر، وعذاب القبر." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_4", text: "اللهم آت نفسي تقواها، وزكها أنت خير من زكاها. أنت وليها ومولاها. اللهم إني أعوذ بك من علم لا ينفع، ومن قلب لا يخشع، ومن نفس لا تشبع، ومن دعوة لا يستجاب لها." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_5", text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والجبن، والبخل، وضلع الدين، وغلبه الرجال." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_6", text: "اللهم إني أعوذ بك من جهد البلاء، ودرك الشقاء، وسوء القضاء، وشماتة الأعداء." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_7", text: "اللهم إني أعوذ بك من يوم السوء، ومن ليلة السوء، ومن ساعة السوء، ومن صاحب السوء، ومن جار السوء في دار المقامة." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_8", text: "اللهم إني أعوذ بك من الهدم، وأعوذ بك من التردي، وأعوذ بك من الغرق، والحرق، وأعوذ بك أن أموت لدغا." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_9", text: "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_10", text: "اللهم إني أعوذ برضاك من سخطك وبمعافاتك من عقوبتك، وأعوذ بك منك، لا أحصي ثناء عليك أنت كما أثنيت على نفسك." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_11", text: "اللهم جنبني منكرات الأخلاق، والأهواء، والأعمال، والأدواء." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_12", text: "اللهم إني أعوذ بك من شر سمعي وبصري وقلبي ومني." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_13", text: "اللهم إني أعوذ بك من البرص، والجنون، والجذام، ومن سيئ الأسقام." },
      { id: "seeking_refuge_from_physical_and_psychological_ailments_14", text: "اللهم إني أعوذ بك من الفقر، والقلة، والذلة، وأعوذ بك من أن أظلم أو أظلم." },
    ],
  },
  {
    id: "seeking_refuge_from_trials",
    title: "الاستعاذة بالله من الفتن",
    duas: [
      { id: "seeking_refuge_from_trials_1", text: "اللهم إني أسألك فعل الخيرات وترك المنكرات وحب المساكين، وإذا أردت بعبادك فتنة فاقبضني إليك غير مفتون." },
      { id: "seeking_refuge_from_trials_2", text: "اللهم إني أعوذ بك من الكسل والهرم، والمغرم والمأثم، اللهم إني أعوذ بك من عذاب النار وفتنة النار، وفتنة القبر وعذاب القبر، وشر فتنة الغنى، وشر فتنة الفقر، ومن شر فتنة المسيح الدجال، اللهم اغسل خطاياي بماء الثلج والبرد، ونق قلبي من الخطايا كما ينقى الثوب الأبيض من الدنس، وباعد بيني وبين خطاياي كما باعدت بين المشرق والمغرب." },
      { id: "seeking_refuge_from_trials_3", text: "اللهم إني أعوذ بك من عذاب القبر وأعوذ بك من فتنة المسيح الدجال وأعوذ بك من فتنة المحيا والممات اللهم إني أعوذ بك من المأثم والمغرم." },
      { id: "seeking_refuge_from_trials_4", text: "ربنا لا تجعلنا فتنة للذين كفروا واغفر لنا ربنا إنك أنت العزيز الحكيم." },
      { id: "seeking_refuge_from_trials_5", text: "ربنا لا تجعلنا فتنة للقوم الظالمين." },
    ],
  },
  {
    id: "asking_allah_for_protection_and_support",
    title: "سؤال الله الحفظ و النصرة",
    duas: [
      { id: "asking_allah_for_protection_and_support_1", text: "رب أدخلني مدخل صدق وأخرجني مخرج صدق واجعل لي من لدنك سلطانا نصيرا." },
      { id: "asking_allah_for_protection_and_support_2", text: "رب نجني من القوم الظالمين." },
      { id: "asking_allah_for_protection_and_support_3", text: "رب أعوذ بك من همزات الشياطين وأعوذ بك رب أن يحضرون." },
      { id: "asking_allah_for_protection_and_support_4", text: "رب أعني ولا تعن علي، وانصرني ولا تنصر علي، وامكر لي ولا تمكر علي، واهدني ويسر هداي إلي، وانصرني على من بغى علي اللهم اجعلني لك شاكرا لك ذاكرا لك رهابا لك مطواعا إليك مخبتا أو منيبا رب تقبل توبتي واغسل حوبتي، وأجب دعوتي وثبت حجتي واهد قلبي وسدد لساني واسلل سخيمة قلبي." },
      { id: "asking_allah_for_protection_and_support_5", text: "اللهم احفظني بالإسلام قائما، واحفظني بالإسلام قاعدا، واحفظني بالإسلام راقدا، ولا تشمت بي عدوا حاسدا، اللهم إني أسألك من كل خير خزائنه بيدك، وأعوذ بك من كل شر خزائنه بيدك." },
    ],
  },
  {
    id: "conclusion_of_dua",
    title: "ختام الدعاء",
    duas: [
      { id: "conclusion_of_dua_1", text: "اللهم صل على محمد، وعلى آل محمد، كما صليت على إبراهيم، وعلى آل إبراهيم، إنك حميد مجيد، وبارك على محمد، وعلى آل محمد، كما باركت على إبراهيم، وعلى آل إبراهيم، في العالمين إنك حميد مجيد." },
      { id: "conclusion_of_dua_2", text: "ربنا تقبل منا إنك أنت السميع العليم." },
      { id: "conclusion_of_dua_3", text: "سبحان ربك رب العزة عما يصفون * وسلام على المرسلين * والحمد لله رب العالمين." },
    ],
  },
];
