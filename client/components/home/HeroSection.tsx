'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, CheckCircle2, Github, ShieldCheck } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Wireframe } from '@react-three/drei';

function WireframeGlobe() {
  const meshRef = useRef<any>(null);

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} scale={2.2}>
      <meshBasicMaterial color="#09090b" />
      <Wireframe stroke={"#3f3f46"} thickness={0.02} fillMix={0} />
      {/* Subtle core glow */}
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#fafafa" transparent opacity={0.02} />
      </mesh>
    </Sphere>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-element', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-center pt-24 pb-12 overflow-hidden bg-hero-glow">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="z-10 mt-12 lg:mt-0">
          <div className="hero-element inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-2/50 text-xs font-semibold text-text-secondary mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
            Hustlr Enterprise Platform V2
          </div>
          
          <h1 className="hero-element text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Elite Engineering.<br />
            <span className="text-text-muted">Verified Students.</span>
          </h1>
          
          <p className="hero-element text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed mb-10">
            Connect with technical university talent for scalable web applications, systems architecture, and UX design. Secured by escrow and admin-verified.
          </p>
          
          <div className="hero-element flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/gigs" className="btn-primary h-12 px-8 text-base shadow-[0_0_20px_rgba(250,250,250,0.15)] hover:shadow-[0_0_30px_rgba(250,250,250,0.25)]">
              Explore Directory
            </Link>
            <Link href="/register" className="btn-secondary h-12 px-8 text-base">
              Join the Network
            </Link>
          </div>

          <div className="hero-element flex flex-wrap gap-6 text-sm text-text-secondary font-medium">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-success" /> Admin Verified</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-white" /> Escrow Protection</div>
            <div className="flex items-center gap-2"><Github className="w-5 h-5 text-text-muted" /> OSS Integrated</div>
          </div>
        </div>

        {/* Right 3D Visual */}
        <div className="hero-element relative h-[400px] lg:h-[600px] w-full hidden lg:block perspective-1000">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <WireframeGlobe />
            </Canvas>
          </div>
          {/* Fading transparent overlay to blend object perfectly into background */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#09090b] pointer-events-none z-10 w-1/4 left-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10 h-1/4 bottom-0"></div>
          
          {/* Floating UI Elements */}
          <div className="absolute top-[20%] right-[10%] glass-sm rounded-xl p-4 w-48 z-20 border-white/10 shadow-xl animate-float">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold">AC</div>
              <div>
                <div className="text-xs font-semibold text-white">Alex Chen</div>
                <div className="text-[10px] text-text-muted">MIT '25</div>
              </div>
            </div>
            <div className="h-2 w-full bg-surface rounded-full mb-1"><div className="h-full bg-white w-[80%] rounded-full"></div></div>
            <div className="text-[10px] text-text-secondary text-right">Commit Pushed</div>
          </div>
        </div>

      </div>
    </section>
  );
}
